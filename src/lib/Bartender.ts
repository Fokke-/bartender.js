import type {
  BartenderOptions,
  BartenderBarDefaultOptions,
  BartenderBarOptions,
  BartenderElementQuery,
  BartenderPushElementOptions
} from './types'
import { Queue } from 'async-await-queue'
import { debounce } from 'ts-debounce'
import {
  resolveElement,
  sleep,
  setDvh
} from './utils'
import { BartenderError } from './BartenderError'
import { Bar } from './Bar'
import { PushElement } from './PushElement'

/**
 * Class for creating accessible off-canvas bars.
 */
export class Bartender {

  /** @property {boolean} debug - Enable debug mode? */
  private _debug = false

  /** @property {HTMLElement} el - Main element */
  readonly el: HTMLElement

  /** @property {HTMLElement} contentEl - Content element */
  readonly contentEl: HTMLElement

  /** @property {number} switchTimeout - Time to wait in milliseconds until another bar is opened */
  public switchTimeout = 150

  /** @property {Bar[]} bars - Bars added to the instance */
  readonly bars: Bar[] = []

  /** @property {object} barDefaultOptions - Default options for the bars */
  readonly barDefaultOptions: BartenderBarOptions = {
    el: null,
    position: 'left',
    mode: 'float',
    overlay: true,
    permanent: false,
    scrollTop: true,
  }

  /** @property {HTMLElement|null} returnFocus - Reference to the element to which focus will be restored after closing the bar */
  private returnFocus?: HTMLElement | null = null

  /** @property {PushElement[]} pushableElements - Pushable elements added to the instance */
  private pushableElements: PushElement[] = []

  /** @property {object} queue - Queue for actions */
  private queue: Queue

  /** @property {Function} resizeDebounce - Debouncer for resizing */
  private resizeDebounce

  /** @property {Function} resizeDebounce - Debouncer for resizing */
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
  constructor (
    options: BartenderOptions = {},
    barOptions: BartenderBarDefaultOptions = {}
  ) {
    // Polyfill DVH units
    setDvh()
    document.addEventListener('DOMContentLoaded', () => {
      setDvh()
    })

    this.debug = options.debug ?? this._debug
    this.switchTimeout = options.switchTimeout ?? this.switchTimeout
    this.barDefaultOptions = {
      ...this.barDefaultOptions,
      ...barOptions,
    }

    // Main element
    const el = resolveElement(options.el || '.bartender')
    if (!el) throw new BartenderError('Main element is required')
    this.el = el
    this.el.classList.add('bartender')

    // Content element
    const contentEl = resolveElement(options.contentEl || '.bartender__content')
    if (!contentEl) throw new BartenderError('Content element is required')
    if (contentEl.parentElement !== this.el) throw new BartenderError('Content element must be a direct child of the main element')
    this.contentEl = contentEl
    this.contentEl.classList.add('bartender__content')
    this.contentEl.setAttribute('tabindex', '-1')

    // Register content element as pushable element
    this.addPushElement(this.contentEl, {
      modes: [
        'push',
        'reveal',
      ],
    })

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
    window.addEventListener('keydown', this.onKeydownHandler)

    this.onResizeHandler = this.onResize.bind(this)
    window.addEventListener('resize', this.onResizeHandler)

    this.el.classList.add('bartender--ready')
    this.el.dispatchEvent(new CustomEvent('bartender-init', {
      bubbles: true,
      detail: { bartender: this },
    }))

    if (this.debug) console.debug('Bartender initialized', this)
  }

  /** @type {boolean} */
  get debug () {
    return this._debug
  }

  /** @type {boolean} */
  set debug (val: boolean) {
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
  public async destroy (): Promise<this> {
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
    this.el.classList.remove('bartender', 'bartender--ready')
    this.contentEl.classList.remove('bartender__content')

    // Remove event listeners
    window.removeEventListener('bartender-bar-updated', this.onBarUpdateHandler)
    window.removeEventListener('keydown', this.onKeydownHandler)
    window.removeEventListener('resize', this.onResizeHandler)

    this.el.dispatchEvent(new CustomEvent('bartender-destroyed', {
      bubbles: true,
      detail: { bartender: this },
    }))

    if (this.debug) console.debug('Bartender destroyed', this)

    return Promise.resolve(this)
  }

  /**
   * Get bar by name
   *
   * @param {string} name - Bar name
   * @returns {object|null}
   */
  public getBar (name: string): Bar | null {
    return this.bars.find(item => item.name === name) || null
  }

  /**
   * Get currently open bar
   *
   * @returns {object|null}
   */
  private getOpenBar (): Bar | null {
    return this.bars.find(item => item.isOpen() === true) || null
  }

  /**
   * Add a new bar
   *
   * @param {string} name - Unique name for the bar
   * @param {object} options - Bar options
   * @throws {BartenderError}
   * @returns {object} Bar object
   */
  public addBar (name: string, options: BartenderBarOptions = {}): Bar {
    if (!name || typeof name !== 'string') throw new BartenderError('Bar name is required')
    if (this.getBar(name)) throw new BartenderError(`Bar with name '${name}' is already defined`)

    // Create a new bar
    const bar = new Bar(name, {
      ...this.barDefaultOptions,
      ...options,
    })

    // Set debug mode
    bar.debug = this.debug

    // Check that element is not assigned to another bar
    if (this.bars.some(item => item.el === bar.el)) throw new BartenderError(`Element of bar '${bar.name}' is already being used for another bar`)

    // Check that bar element is a direct child on main element
    if (bar.el.parentElement !== this.el) throw new BartenderError(`Element of bar '${bar.name}' must be a direct child of the Bartender main element`)

    // Insert overlay element
    this.el.appendChild(bar.overlayObj.el)
    bar.overlayObj.el.addEventListener('click', () => {
      if (bar.permanent === true) return

      this.close()
    })

    // Set overlay as pushable element
    this.addPushElement(bar.overlayObj.el, {
      bars: [
        bar,
      ],
    })

    this.bars.push(bar)

    this.el.dispatchEvent(new CustomEvent('bartender-bar-added', {
      bubbles: true,
      detail: { bar },
    }))

    if (this.debug) console.debug('Added a new bar', bar)

    return bar
  }

  /**
   * Remove bar
   *
   * @param {string} name - Bar name
   * @throws {BartenderError}
   * @returns {Promise<this>}
   */
  public async removeBar (name: string): Promise<this> {
    if (!name || typeof name !== 'string') throw new BartenderError('Bar name is required')

    const bar = this.getBar(name)
    if (!bar) throw new BartenderError(`Bar with name '${name}' was not found`)
    if (this.getOpenBar() === bar) this.close()

    this.removePushElement(bar.overlayObj.el)
    bar.destroy()

    const barIndex = this.bars.findIndex(item => item.name === name)
    this.bars.splice(barIndex, 1)

    this.el.dispatchEvent(new CustomEvent('bartender-bar-removed', {
      bubbles: true,
      detail: { name },
    }))

    if (this.debug) console.debug(`Removed bar '${name}'`)

    return Promise.resolve(this)
  }

  /**
   * Open bar
   *
   * @param {string} name - Bar name
   * @throws {BartenderError}
   * @returns {Promise<Bar>}
   */
  private async openBar (name: string): Promise<Bar> {
    const bar = this.getBar(name)
    if (!bar) throw new BartenderError(`Unknown bar '${name}'`)
    if (bar.isOpen() === true) return Promise.resolve(bar)

    // Close any open bar
    const openBar = this.getOpenBar()

    if (openBar) {
      await this.closeBar(openBar.name, true)
      await sleep(this.switchTimeout)
    }

    this.el.classList.add('bartender--open')
    this.contentEl.setAttribute('aria-hidden', 'true')
    this.pushElements(bar)

    return bar.open()
  }

  /**
   * Open bar
   *
   * @param {string} name - Bar name
   * @param {HTMLElement|null} returnFocus - Reference to the element to which focus will be restored after closing the bar
   * @returns {Promise<Bar>}
   */
  public async open (name: string, returnFocus?: HTMLElement | null): Promise<Bar> {
    const id = Symbol()
    await this.queue.wait(id)

    this.returnFocus = returnFocus

    return this.openBar(name).finally(() => {
      this.queue.end(id)
    })
  }

  /**
   * Close bar
   *
   * @param {string} name - Bar name
   * @param {boolean} switching - Will another bar open immediately after closing?
   * @returns {Promise<Bar|null>}
   */
  private async closeBar (name?: string, switching = false): Promise<Bar | null> {
    const bar = name ? this.getBar(name) : this.getOpenBar()
    if (!bar || !bar.isOpen()) return Promise.resolve(null)

    this.pullElements(bar)
    await bar.close()

    // If we going to open another bar right after closing the current one,
    // don't update elements yet.
    if (switching === false) {
      this.el.classList.remove('bartender--open')
      this.contentEl.setAttribute('aria-hidden', 'false')
    }

    return Promise.resolve(bar)
  }

  /**
   * Close bar
   *
   * @param {string} name - Bar name
   * @returns {Promise<Bar|null>}
   */
  public async close (name?: string): Promise<Bar | null> {
    const id = Symbol()
    await this.queue.wait(id)

    return this.closeBar(name).finally(() => {
      this.queue.end(id)

      // Return focus
      if (this.returnFocus) {
        this.returnFocus.focus()
        this.returnFocus = null
        return
      }

      this.contentEl.focus()
    })
  }

  /**
   * Toggle bar
   *
   * @param {string} name - Bar name
   * @param {HTMLElement|null} returnFocus - Reference to the element to which focus will be restored after closing the bar
   * @throws {BartenderError}
   * @returns {Promise<Bar|null>}
   */
  public async toggle (name: string, returnFocus?: HTMLElement | null): Promise<Bar | null> {
    const bar = this.getBar(name)
    if (!bar) throw new BartenderError(`Unknown bar '${name}'`)

    return (bar.isOpen() === true) ? this.close() : this.open(name, returnFocus)
  }

  /**
   * Add a new pushable element
   *
   * @param {BartenderElementQuery} el - Pushable element
   * @param {object} options - Options for pushable element
   * @returns {PushElement}
   */
  public addPushElement (el: BartenderElementQuery, options: BartenderPushElementOptions = {}): PushElement {
    if (this.pushableElements.some(item => item.el === el)) throw new BartenderError('This element is already defined as pushable element.')

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
  public removePushElement (el: Element): PushElement[] {
    const index = this.pushableElements.findIndex(item => item.el === el)
    if (index === -1) throw new BartenderError('Pushable element was not found')

    if (this.debug) console.debug('Removed pushable element', this.pushableElements[index])
    this.pushableElements.splice(index, 1)

    return this.pushableElements
  }

  /**
   * Push elements
   *
   * @param {Bar|null} bar - The bar from which the styles are fetched
   * @returns {PushElement[]}
   */
  private pushElements (bar: Bar | null): PushElement[] {
    if (!bar || !this.pushableElements.length) return this.pushableElements

    const pushStyles = bar.getPushStyles()

    for (const item of this.pushableElements) {
      item.push(bar, pushStyles)
    }

    return this.pushableElements
  }

  /**
   * Pull elements and return them to the original position
   *
   * @param {Bar|null} bar - The bar from which the styles are fetched
   * @returns {PushElement[]}
   */
  private pullElements (bar: Bar | null): PushElement[] {
    if (!bar || !this.pushableElements.length) return this.pushableElements

    const pushStyles = bar.getPushStyles()

    for (const item of this.pushableElements) {
      item.pull(pushStyles)
    }

    return this.pushableElements
  }

  /**
   * Handler for bartender-bar-updated event
   *
   * @returns {void}
   */
  private onBarUpdate (): void {
    this.pushElements(this.getOpenBar())
  }

  /**
   * Handler for keydown event
   *
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  private onKeydown (event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      const openBar = this.getOpenBar()
      if (!openBar || openBar.permanent === true) return

      this.close()
    }
  }

  /**
   * Handler for resize event
   *
   * @returns {void}
   */
  private onResize (): void {
    this.resizeDebounce()
  }

}
