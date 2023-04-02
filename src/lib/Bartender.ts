import type {
  BartenderOptions,
  BartenderBarOptions,
  BartenderPushElementOptions
} from './types'
import { Queue } from 'async-await-queue'
import { debounce } from 'ts-debounce'
import {
  resolveElement,
  sleep
} from './utils'
import { BartenderError } from './BartenderError'
import { Bar } from './Bar'
import { PushElement } from './PushElement'

export class Bartender {
  // TODO: add support for focus traps

  private queue: Queue
  private resizeDebounce
  public debug = false
  readonly el: HTMLElement
  readonly contentEl: HTMLElement
  readonly switchTimeout: number = 150
  readonly bars: Bar[] = []
  private pushableElements: PushElement[] = []
  private barDefaultOptions: BartenderBarOptions = {
    el: null,
    position: 'left',
    mode: 'float',
    overlay: true,
    permanent: false,
    scrollTop: true,
  }
  private onKeydownHandler
  private onResizeHandler

  constructor (
    options: BartenderOptions = {},
    barOptions: BartenderBarOptions = {}
  ) {
    this.debug = options.debug ?? this.debug
    this.switchTimeout = options.switchTimeout ?? this.switchTimeout
    this.barDefaultOptions = Object.assign(this.barDefaultOptions, barOptions)

    // Get main element
    const el = resolveElement(options.el || '.bartender')
    if (!el) throw new BartenderError('Main element is required')
    this.el = el
    this.el.classList.add('bartender')

    // Get content element
    const contentEl = resolveElement(options.contentEl || '.bartender__content')
    if (!contentEl) throw new BartenderError('Content element is required')
    if (contentEl.parentElement !== this.el) throw new BartenderError('Content element must be a direct child of the main element')
    this.contentEl = contentEl
    this.contentEl.classList.add('bartender__content')

    // Register content element as pushable element
    this.addPushElement({
      el: this.contentEl,
      modes: [
        'push',
        'reveal',
      ],
    })

    // Initialize queue
    this.queue = new Queue(1)

    // Debouncer for resizing
    this.resizeDebounce = debounce(() => {
      this.pushElements(this.getOpenBar())
    }, 100)

    // Add event listeners
    this.onKeydownHandler = this.onKeydown.bind(this)
    window.addEventListener('keydown', this.onKeydownHandler)

    this.onResizeHandler = this.onResize.bind(this)
    window.addEventListener('resize', this.onResizeHandler)

    this.el.classList.add('bartender--ready')
    this.el.dispatchEvent(new CustomEvent('bartender-init', {
      bubbles: true,
      detail: { bartender: this },
    }))
  }

  public async destroy (removeBarElements = false): Promise<this> {
    // Get all bar names
    const barNames = this.bars.reduce((acc: string[], bar) => {
      acc.push(bar.name)
      return acc
    }, [])

    // Remove bars
    for (const name of barNames) {
      if (!this.getBar(name)) continue

      await this.removeBar(name, removeBarElements)
    }

    // Remove classes
    this.el.classList.remove('bartender', 'bartender--ready')
    this.contentEl.classList.remove('bartender__content')

    // Remove event listeners
    window.removeEventListener('keydown', this.onKeydownHandler)
    window.removeEventListener('resize', this.onResizeHandler)

    this.el.dispatchEvent(new CustomEvent('bartender-destroyed', {
      bubbles: true,
      detail: { bartender: this },
    }))

    return Promise.resolve(this)
  }

  public getBar (name: string): Bar | null {
    return this.bars.find(item => item.name === name) || null
  }

  private getOpenBar (): Bar | null {
    return this.bars.find(item => item.isOpen() === true) || null
  }

  // TODO: sanitize name
  public addBar (name: string, userOptions: BartenderBarOptions = {}): Bar | BartenderError {
    if (!name || typeof name !== 'string') throw new BartenderError('Bar name is required')
    if (this.getBar(name)) throw new BartenderError(`Bar with name '${name}' is already defined`)

    // Create a new bar
    const bar = new Bar(name, {
      ...this.barDefaultOptions,
      ...userOptions,
    })

    // Check that bar element is a direct child on main element
    if (bar.el.parentElement !== this.el) throw new BartenderError(`Element of bar '${bar.name}' must be a direct child of the Bartender main element`)

    // Insert overlay element
    this.contentEl?.appendChild(bar.overlayObj.el)
    bar.overlayObj.el.addEventListener('click', () => {
      if (bar.permanent === true) return

      this.close()
    })

    this.bars.push(bar)

    this.el.dispatchEvent(new CustomEvent('bartender-bar-added', {
      bubbles: true,
      detail: { bar },
    }))

    return bar
  }

  public async removeBar (name: string, removeElement = false): Promise<this> {
    if (!name || typeof name !== 'string') throw new BartenderError('Bar name is required')

    const bar = this.getBar(name)
    if (!bar) throw new BartenderError(`Bar with name '${name}' was not found`)

    if (this.getOpenBar() === bar) await this.close()

    bar.destroy(removeElement)

    const barIndex = this.bars.findIndex(item => item.name === name)
    this.bars.splice(barIndex, 1)

    this.el.dispatchEvent(new CustomEvent('bartender-bar-removed', {
      bubbles: true,
      detail: { name },
    }))

    return Promise.resolve(this)
  }

  private async openBar (name: string): Promise<Bar | BartenderError> {
    const bar = this.getBar(name)
    if (!bar) return Promise.reject(new BartenderError(`Unknown bar '${name}'`))
    if (bar.isOpen() === true) return Promise.resolve(bar)

    // Close any open bar
    const openBar = this.getOpenBar()

    if (openBar) {
      await this.closeBar(openBar.name, false)
      await sleep(this.switchTimeout)
    }

    this.el.classList.add('bartender--open')
    this.pushElements(bar)

    return bar.open()
  }

  public async open (name: string): Promise<Bar | Error> {
    const id = Symbol()
    await this.queue.wait(id)

    return this.openBar(name).finally(() => {
      this.queue.end(id)
    })
  }

  private async closeBar (name?: string, removeOpenClass = true): Promise<Bar | null> {
    const bar = name ? this.getBar(name) : this.getOpenBar()
    if (!bar || !bar.isOpen()) return Promise.resolve(null)

    this.pullElements()
    await bar.close()

    if (removeOpenClass === true) this.el.classList.remove('bartender--open')

    return Promise.resolve(bar)
  }

  public async close (name?: string): Promise<Bar | null> {
    const id = Symbol()
    await this.queue.wait(id)

    return this.closeBar(name).finally(() => {
      this.queue.end(id)
    })
  }

  public async toggle (name: string): Promise<Bar | BartenderError | null> {
    const bar = this.getBar(name)
    if (!bar) return Promise.reject(new BartenderError(`Unknown bar '${name}'`))

    return (bar.isOpen() === true) ? this.close() : this.open(name)
  }

  public addPushElement (options: BartenderPushElementOptions = {}): PushElement {
    const pushElement = new PushElement(options)
    this.pushableElements.push(pushElement)

    return pushElement
  }

  // TODO: support pushing elements without transition
  private pushElements (bar: Bar | null): PushElement[] {
    if (!bar || !this.pushableElements.length) return this.pushableElements

    const pushStyles = bar.getPushStyles()

    for (const item of this.pushableElements) {
      item.push(bar, pushStyles)
    }

    return this.pushableElements
  }

  private pullElements (): PushElement[] {
    if (!this.pushableElements.length) this.pushableElements

    for (const item of this.pushableElements) {
      item.pull()
    }

    return this.pushableElements
  }

  private onKeydown (event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      const openBar = this.getOpenBar()
      if (!openBar || openBar.permanent === true) return

      this.close()
    }
  }

  private onResize (): void {
    this.resizeDebounce()
  }
}
