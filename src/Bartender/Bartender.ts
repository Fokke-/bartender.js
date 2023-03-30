import type {
  BartenderOptions,
  BartenderBars,
  BartenderBarOptions,
  BartenderPushElementOptions,
  BartenderPushStyles,
  BartenderPushableElements
} from './Bartender.d'
import { Queue } from 'async-await-queue'
import { resolveElement, sleep } from './utils'
import { BartenderError } from './BartenderError'
import { Bar } from './Bar'
import { PushElement } from './PushElement'

/**
 * Class for creating accessible off-canvas bars.
 */
export class Bartender {
  // TODO: refresh pushable elements when resizing
  // TODO: overlay should be defined per bar
  // TODO: trapFocus should be defined per bar
  // TODO: scrollTop should be defined per bar
  // TODO: create custom error class with 'Bartender:' prefix

  private queue: Queue
  public debug = false
  readonly mainEl?: HTMLElement | HTMLBodyElement | null
  readonly mainElSelector: string = '.bartender'
  readonly contentEl?: HTMLElement | null
  readonly contentElSelector: string = '.bartender__content'
  readonly switchTimeout: number = 150
  readonly bars: BartenderBars = []
  private pushableElements: BartenderPushableElements = []
  private barOptions: BartenderBarOptions = {
    position: 'left',
    mode: 'float',
    permanent: false,
  }

  constructor (
    options: BartenderOptions = {},
    barOptions: BartenderBarOptions = {}
  ) {
    this.debug = options.debug ?? this.debug
    this.mainElSelector = options.mainElSelector ?? this.mainElSelector
    this.contentElSelector = options.contentElSelector ?? this.contentElSelector
    this.switchTimeout = options.switchTimeout ?? this.switchTimeout
    this.barOptions = Object.assign(this.barOptions, barOptions)

    // Get main element
    this.mainEl = resolveElement(options.mainEl, this.mainElSelector)
    if (!this.mainEl) throw new BartenderError('Main element is required')

    // Get content element
    this.contentEl = resolveElement(options.contentEl, this.contentElSelector)
    if (!this.contentEl) throw new BartenderError('Content element is required')

    // Register content element as pushable element
    this.addPushElement({
      el: this.contentEl,
    })

    // Check that content element is a direct child of the main element
    if (this.contentEl.parentElement !== this.mainEl) throw new BartenderError('Content element must be a direct child of the main element')

    // Initialize queue
    this.queue = new Queue(1)

    // Add event listeners
    window.addEventListener('keydown', this.handleKeydown.bind(this))

    this.mainEl.classList.add('bartender--ready')
    this.mainEl.dispatchEvent(new CustomEvent('bartender-init', {
      bubbles: true,
      detail: {
        bartender: this,
      },
    }))
  }

  // TODO: finish this
  public destroy () : void {
    this.mainEl?.classList.remove('bartender--ready')

    // TODO: Tear down event listeners
  }

  public getBar (name: string): Bar | null {
    return this.bars.find(item => item.name === name) || null
  }

  private getOpenBar (): Bar | null {
    return this.bars.find(item => item.isOpen() === true) || null
  }

  public addBar (name: string, userOptions: BartenderBarOptions = {}): Bar | BartenderError {
    if (!name || typeof name !== 'string') throw new BartenderError('Name is required')
    if (this.getBar(name)) throw new BartenderError(`Bar with name '${name}' is already defined`)

    const options: BartenderBarOptions = {
      ...this.barOptions,
      ...userOptions,
    }

    // Create a new bar
    const bar = new Bar(name, options)

    // Insert overlay element
    this.contentEl?.appendChild(bar.overlayObj.el)
    bar.overlayObj.el.addEventListener('click', () => {
      if (bar.permanent === true) return

      this.close()
    })

    this.bars.push(bar)

    this.mainEl?.dispatchEvent(new CustomEvent('bartender-bar-added', {
      bubbles: true,
      detail: {
        bar,
      },
    }))

    return bar
  }

  // TODO: add removeBar
  private async openBar (name: string): Promise<Bar | BartenderError> {
    const bar = this.getBar(name)
    if (!bar) return Promise.reject(new BartenderError(`Unknown bar '${name}'`))
    if (bar.isOpen() === true) return Promise.resolve(bar)

    // Close any open bar
    if (this.getOpenBar()) {
      await this.closeBar(false)
      await sleep(this.switchTimeout)
    }

    this.mainEl?.classList.add('bartender--open')
    // TODO: do this elsewhere?
    bar.overlayObj.show()
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

  private async closeBar (removeOpenClass = true): Promise<Bar | null> {
    const bar = this.getOpenBar()
    if (!bar) return Promise.resolve(null)

    this.pullElements()
    // TODO: do this elsewhere?
    bar.overlayObj.hide()
    await bar.close()

    if (removeOpenClass === true) this.mainEl?.classList.remove('bartender--open')

    return Promise.resolve(bar)
  }

  public async close (): Promise<Bar | null> {
    const id = Symbol()
    await this.queue.wait(id)

    return this.closeBar().finally(() => {
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

  private pushElements (bar: Bar): Promise<BartenderPushableElements> {
    return new Promise(resolve => {
      if (!bar || !this.pushableElements.length) return resolve(this.pushableElements)

      const pushStyles = bar.getPushStyles()

      for (const item of this.pushableElements) {
        item.push(bar, pushStyles)
      }

      return resolve(this.pushableElements)
    })
  }

  private pullElements (): Promise<BartenderPushableElements> {
    return new Promise(resolve => {
      if (!this.pushableElements.length) return Promise.resolve(this.pushableElements)

      for (const item of this.pushableElements) {
        item.pull()
      }

      return resolve(this.pushableElements)
    })
  }

  private handleKeydown (event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      const openBar = this.getOpenBar()
      if (!openBar || openBar.permanent === true) return

      this.close()
    }
  }
}
