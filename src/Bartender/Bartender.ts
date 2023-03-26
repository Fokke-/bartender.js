import type {
  BartenderOptions,
  BartenderBars,
  BartenderBarOptions,
  BartenderPushElementOptions,
  BartenderPushStyles,
  BartenderPushableElements
} from './Bartender.d'
import { resolveElement, sleep } from './utils'
import { BartenderBar } from './BartenderBar'
import { Queue } from 'async-await-queue'

/**
 * Class for creating accessible off-canvas bars.
 */
export class Bartender {
  // TODO: refresh pushable elements when resizing
  // TODO: overlay should be defined per bar
  // TODO: closeOnOverlayClick should be defined per bar
  // TODO: closeOnEsc should be defined per bar
  // TODO: trapFocus should be defined per bar
  // TODO: scrollTop should be defined per bar

  private queue: Queue
  public debug = false
  readonly mainEl?: HTMLElement | HTMLBodyElement | null
  readonly mainElSelector?: string
  readonly contentEl?: HTMLElement | null
  readonly contentElSelector?: string
  readonly switchTimeout?: number
  readonly bars: BartenderBars = []
  private pushableElements: BartenderPushableElements = []
  public barOptions = {}

  constructor (
    userOptions: BartenderOptions = {},
    userBarOptions: BartenderBarOptions = {}
  ) {
    // Set options
    const defaultOptions: BartenderOptions = {
      debug: false,
      mainEl: undefined,
      mainElSelector: '.bartender',
      contentEl: undefined,
      contentElSelector: '.bartender__content',
      switchTimeout: 150,
    }

    Object.assign(this, {
      ...defaultOptions,
      ...userOptions,
    })

    // Set default options for new bars
    const defaultBarOptions: BartenderBarOptions = {
      position: 'left',
      mode: 'float',
      permanent: false,
    }

    this.barOptions = {
      ...defaultBarOptions,
      ...userBarOptions,
    }

    // Get main element
    this.mainEl = resolveElement(this.mainEl, this.mainElSelector)
    if (!this.mainEl) throw 'Main element is required'

    // Get content element
    this.contentEl = resolveElement(this.contentEl, this.contentElSelector)
    if (!this.contentEl) throw 'Content element is required'

    // Register content element as pushable element
    this.addPushElement({
      el: this.contentEl,
    })

    // Check that content element is a direct child of the main element
    if (this.contentEl.parentElement !== this.mainEl) throw 'Content element must be a direct child of the main element'

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

  // TODO: make sure this is updated
  public destroy () : void {
    this.mainEl?.classList.remove('bartender--ready')

    // TODO: Tear down event listeners
  }

  public getBar (name: string): BartenderBar | null {
    return this.bars.find(item => item.name === name) || null
  }

  private getOpenBar (): BartenderBar | null {
    return this.bars.find(item => item.isOpen === true) || null
  }

  public addBar (name: string, userOptions: BartenderBarOptions = {}): Promise<BartenderBar | Error> {
    if (!name || typeof name !== 'string') return Promise.reject(new Error('Name is required'))
    if (this.getBar(name)) return Promise.reject(new Error(`Bar with name '${name}' is already defined`))

    const options: BartenderBarOptions = {
      ...this.barOptions,
      ...userOptions,
    }

    const bar = new BartenderBar(name, options)
    this.bars.push(bar)

    this.mainEl?.dispatchEvent(new CustomEvent('bartender-bar-added', {
      bubbles: true,
      detail: {
        bar,
      },
    }))

    return Promise.resolve(bar)
  }

  private async openBar (name: string): Promise<BartenderBar | Error> {
    const bar = this.getBar(name)
    if (!bar) return Promise.reject(new Error(`Unknown bar '${name}'`))
    if (bar.isOpen === true) return Promise.resolve(bar)

    // Close any open bar
    if (this.getOpenBar()) {
      await this.closeBar(false)
      await sleep(this.switchTimeout)
    }

    this.mainEl?.classList.add('bartender--open')

    if (bar.isPushing === true) await this.pushElements(bar.getPushStyles())

    return bar.open()
  }

  public async open (name: string): Promise<BartenderBar | Error> {
    const id = Symbol()
    await this.queue.wait(id)

    return this.openBar(name).finally(() => {
      this.queue.end(id)
    })
  }

  private async closeBar (removeOpenClass = true): Promise<BartenderBar | null> {
    const bar = this.getOpenBar()
    if (!bar) return Promise.resolve(null)

    this.pullElements()
    await bar.close()

    if (removeOpenClass === true) this.mainEl?.classList.remove('bartender--open')

    return Promise.resolve(bar)
  }

  public async close (): Promise<BartenderBar | null> {
    const id = Symbol()
    await this.queue.wait(id)

    return this.closeBar().finally(() => {
      this.queue.end(id)
    })
  }

  public async toggle (name: string): Promise<BartenderBar | Error | null> {
    const bar = this.getBar(name)
    if (!bar) return Promise.reject(new Error(`Unknown bar '${name}'`))

    return (bar.isOpen === true) ? this.close() : this.open(name)
  }

  // TODO: support push elements per bar
  public addPushElement (options: BartenderPushElementOptions = {}): Promise<HTMLElement | HTMLBodyElement> {
    const el = resolveElement(options.el, options.elSelector)
    if (!el) return Promise.reject(new Error('Unknown push element'))

    this.pushableElements.push(el)

    return Promise.resolve(el)
  }

  private pushElements (pushStyles: BartenderPushStyles | null): Promise<BartenderPushableElements> {
    return new Promise(resolve => {
      if (!pushStyles || !this.pushableElements.length) return resolve(this.pushableElements)

      for (const el of this.pushableElements) {
        el.style.transform = pushStyles.transform
        el.style.transitionDuration = pushStyles.transitionDuration
        el.style.transitionTimingFunction = pushStyles.transitionTimingFunction
      }

      return resolve(this.pushableElements)
    })
  }

  private pullElements (): Promise<BartenderPushableElements> {
    return new Promise(resolve => {
      if (!this.pushableElements.length) return Promise.resolve(this.pushableElements)

      for (const el of this.pushableElements) {
        el.style.transform = 'translateX(0) translateY(0)'
      }

      return resolve(this.pushableElements)
    })
  }

  private handleKeydown (event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close()
    }
  }
}
