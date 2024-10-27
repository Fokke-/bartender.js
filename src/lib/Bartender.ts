import type {
  BartenderOptions,
  BartenderBarDefaultOptions,
  BartenderBarOptions,
  BartenderElementQuery,
  BartenderPushElementOptions,
} from './types'
import { Queue } from 'async-await-queue'
import { debounce } from 'ts-debounce'
import { sleep, setDvh } from './utils'
import { BartenderError } from './BartenderError'
import { BartenderBar } from './BartenderBar'
import { PushElement } from './PushElement'

/**
 * Class for creating accessible off-canvas bars.
 */
export class Bartender {
  /** @property {boolean} debug - Enable debug mode? */
  private _debug: boolean = false

  /** @property {number} switchTimeout - Time to wait in milliseconds until another bar is opened */
  public switchTimeout: number = 150

  /** @property {Bar[]} bars - Bars added to the instance */
  public readonly bars: BartenderBar[] = []

  public readonly openBars: BartenderBar[] = []

  /** @property {object} barDefaultOptions - Default options for the bars */
  private readonly barDefaultOptions: BartenderBarOptions = {
    el: null,
    position: 'left',
    overlay: true,
    permanent: false,
    scrollTop: true,
  }

  /** @property {PushElement[]} pushableElements - Pushable elements added to the instance */
  private pushableElements: PushElement[] = []

  /** @property {object} queue - Queue for actions */
  private queue: Queue

  /** @property {Function} resizeDebounce - Debouncer for resizing */
  private resizeDebounce

  /** @property {Function} onBarUpdateHandler - Bandler for bar update evet */
  private onBarUpdateHandler

  /** @property {Function} onKeydownHandler - Handler for keydown event */
  private onKeydownHandler

  /** @property {Function} onKeydownHandler - Handler for resize event */
  private onResizeHandler

  /**
   * Create a new Bartender instance
   *
   * @param {object} options - Instance options
   * @param {object} barOptions - Default options for bars
   * @throws {BartenderError}
   */
  constructor(
    options: BartenderOptions = {},
    barOptions: BartenderBarDefaultOptions = {},
  ) {
    // Polyfill DVH units
    // setDvh()
    // document.addEventListener('DOMContentLoaded', () => {
    //   setDvh()
    // })

    this.debug = options.debug ?? this._debug
    this.switchTimeout = options.switchTimeout ?? this.switchTimeout
    this.barDefaultOptions = {
      ...this.barDefaultOptions,
      ...barOptions,
    }

    // Queue for actions
    this.queue = new Queue(1)

    // Debouncer for resizing
    this.resizeDebounce = debounce(() => {
      setDvh()
      this.pushElements(this.getOpenBar())
    }, 100)

    // Event listeners
    this.onBarUpdateHandler = this.onBarUpdate.bind(this)
    window.addEventListener('bartender-bar-updated', this.onBarUpdateHandler)

    this.onKeydownHandler = this.onKeydown.bind(this)
    document.addEventListener('keydown', this.onKeydownHandler)

    this.onResizeHandler = this.onResize.bind(this)
    window.addEventListener('resize', this.onResizeHandler)

    document.body.classList.add('bartender-ready')
    window.dispatchEvent(
      new CustomEvent('bartender-init', {
        bubbles: true,
        detail: { bartender: this },
      }),
    )

    if (this.debug) console.debug('Bartender initialized', this)
  }

  /** @type {boolean} */
  public get debug() {
    return this._debug
  }

  /** @type {boolean} */
  public set debug(val: boolean) {
    this._debug = val

    for (const bar of this.bars) {
      bar.debug = val
    }
  }

  /**
   * Destroy Bartender instance
   *
   * @returns {Promise<this>}
   */
  public async destroy(): Promise<this> {
    await this.close()

    // Get all bar names
    const barNames = this.bars.reduce((acc: string[], bar) => {
      acc.push(bar.name)
      return acc
    }, [])

    // Remove bars
    for (const name of barNames) {
      if (!this.getBar(name)) continue

      await this.removeBar(name)
    }

    // Remove classes
    document.body.classList.remove('bartender', 'bartender-ready')

    // Remove event listeners
    window.removeEventListener('bartender-bar-updated', this.onBarUpdateHandler)
    document.removeEventListener('keydown', this.onKeydownHandler)
    window.removeEventListener('resize', this.onResizeHandler)

    window.dispatchEvent(
      new CustomEvent('bartender-destroyed', {
        bubbles: true,
        detail: { bartender: this },
      }),
    )

    if (this.debug) console.debug('Bartender destroyed', this)

    return Promise.resolve(this)
  }

  /**
   * Get bar by name
   *
   * @param {string} name - Bar name
   * @returns {object|null}
   */
  public getBar(name: string): BartenderBar | null {
    return this.bars.find((item) => item.name === name) || null
  }

  /**
   * Get currently open bar
   *
   * @returns {object|null}
   */
  private getOpenBar(): BartenderBar | null {
    if (!this.openBars.length) {
      return null
    }

    return this.openBars[this.openBars.length - 1]

    // return this.bars.find((item) => item.isOpen() === true) || null
  }

  /**
   * Add a new bar
   *
   * @param {string} name - Unique name for the bar
   * @param {object} options - Bar options
   * @throws {BartenderError}
   * @returns {object} Bar object
   */
  public addBar(name: string, options: BartenderBarOptions = {}): BartenderBar {
    if (!name || typeof name !== 'string') {
      throw new BartenderError('Bar name is required')
    }

    if (this.getBar(name)) {
      throw new BartenderError(`Bar with name '${name}' is already defined`)
    }

    // Create a new bar
    const bar = new BartenderBar(name, {
      ...this.barDefaultOptions,
      ...options,
    })

    // Set debug mode
    bar.debug = this.debug

    // Check that element is not assigned to another bar
    if (this.bars.some((item) => item.el === bar.el)) {
      throw new BartenderError(
        `Element of bar '${bar.name}' is already being used for another bar`,
      )
    }

    // Handlers for close events
    bar.el.addEventListener('bartender-bar-before-close', () => {
      this.pullElements(bar)
      this.openBars.splice(this.openBars.indexOf(bar), 1)
    })

    bar.el.addEventListener('bartender-bar-after-close', () => {
      if (this.openBars.length) {
        return
      }

      document.body.classList.remove('bartender-open')
    })

    this.bars.push(bar)

    window.dispatchEvent(
      new CustomEvent('bartender-bar-added', {
        bubbles: true,
        detail: { bar },
      }),
    )

    if (this.debug) console.debug('Added a new bar', bar)

    return bar
  }

  /**
   * Remove bar
   *
   * @param {string} name - Bar name
   * @throws {BartenderError}
   * @returns {this}
   */
  public removeBar(name: string): this {
    if (!name || typeof name !== 'string')
      throw new BartenderError('Bar name is required')

    const bar = this.getBar(name)
    if (!bar) throw new BartenderError(`Bar with name '${name}' was not found`)
    if (this.getOpenBar() === bar) this.close()

    bar.destroy()

    const barIndex = this.bars.findIndex((item) => item.name === name)
    this.bars.splice(barIndex, 1)

    window.dispatchEvent(
      new CustomEvent('bartender-bar-removed', {
        bubbles: true,
        detail: { name },
      }),
    )

    if (this.debug) console.debug(`Removed bar '${name}'`)

    return this
  }

  /**
   * Open bar
   *
   * @param {string} name - Bar name
   * @throws {BartenderError}
   * @returns {Promise<Bar>}
   */
  public async open(name: string): Promise<BartenderBar> {
    const bar = this.getBar(name)
    if (!bar) throw new BartenderError(`Unknown bar '${name}'`)
    if (bar.isOpen() === true) return Promise.resolve(bar)

    const id = Symbol()
    await this.queue.wait(id)

    this.openBars.push(bar)

    // Close any open bar
    // const openBar = this.getOpenBar()

    // if (openBar) {
    //   await this.close(openBar.name, true)
    //   await sleep(this.switchTimeout)
    // }

    document.body.classList.add('bartender-open')
    this.pushElements(bar)

    await bar.open().finally(() => {
      this.queue.end(id)
    })

    return bar
  }

  /**
   * Close bar
   */
  public async close(name?: string): Promise<BartenderBar | null> {
    const bar = name ? this.getBar(name) : this.getOpenBar()
    if (!bar || !bar.isOpen()) {
      return null
    }

    await bar.close()

    return bar
  }

  /**
   * Toggle bar
   *
   * @param {string} name - Bar name
   * @throws {BartenderError}
   * @returns {Promise<Bar|null>}
   */
  public async toggle(name: string): Promise<BartenderBar | null> {
    const bar = this.getBar(name)
    if (!bar) throw new BartenderError(`Unknown bar '${name}'`)

    return bar.isOpen() === true ? await this.close() : await this.open(name)
  }

  /**
   * Add a new pushable element
   *
   * @param {BartenderElementQuery} el - Pushable element
   * @param {object} options - Options for pushable element
   * @returns {PushElement}
   */
  public addPushElement(
    el: BartenderElementQuery,
    options: BartenderPushElementOptions = {},
  ): PushElement {
    if (this.pushableElements.some((item) => item.el === el))
      throw new BartenderError(
        'This element is already defined as pushable element.',
      )

    const pushElement = new PushElement(el, options)
    this.pushableElements.push(pushElement)

    if (this.debug) console.debug('Added a new pushable element', pushElement)

    return pushElement
  }

  /**
   * Remove pushable element
   *
   * @param {Element} el - Element to remove
   * @throws {BartenderError}
   * @returns {PushElement[]}
   */
  public removePushElement(el: Element): PushElement[] {
    const index = this.pushableElements.findIndex((item) => item.el === el)
    if (index === -1) throw new BartenderError('Pushable element was not found')

    if (this.debug)
      console.debug('Removed pushable element', this.pushableElements[index])
    this.pushableElements.splice(index, 1)

    return this.pushableElements
  }

  /**
   * Push elements
   *
   * @param {Bar|null} bar - The bar from which the styles are fetched
   * @returns {PushElement[]}
   */
  private async pushElements(bar: BartenderBar | null): Promise<PushElement[]> {
    if (!bar || !this.pushableElements.length) return this.pushableElements

    const pushStyles = await bar.getPushStyles()

    for (const item of this.pushableElements) {
      item.push(bar, pushStyles)
    }

    return Promise.resolve(this.pushableElements)
  }

  /**
   * Pull elements and return them to the original position
   *
   * @param {BartenderBar|null} bar - The bar from which the styles are fetched
   * @returns {PushElement[]}
   */
  private async pullElements(bar: BartenderBar | null): Promise<PushElement[]> {
    if (!bar || !this.pushableElements.length) return this.pushableElements

    const pushStyles = await bar.getPushStyles()

    for (const item of this.pushableElements) {
      item.pull(pushStyles)
    }

    return Promise.resolve(this.pushableElements)
  }

  /**
   * Handler for bartender-bar-updated event
   *
   * @returns {void}
   */
  private onBarUpdate(): void {
    this.pushElements(this.getOpenBar())
  }

  /**
   * Handler for keydown event
   *
   * @param {KeyboardEvent} event - Keyboard event
   * @returns {void}
   */
  private onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      const openBar = this.getOpenBar()
      if (openBar && openBar.permanent === true) {
        event.preventDefault()
        return
      }
    }
  }

  /**
   * Handler for resize event
   *
   * @returns {void}
   */
  private onResize(): void {
    this.resizeDebounce()
  }
}
