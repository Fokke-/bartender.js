import type {
  BartenderOptions,
  BartenderBarOptions,
  BartenderPushElementOptions
} from './types'
import * as focusTrap from 'focus-trap'
import { Queue } from 'async-await-queue'
import { debounce } from 'ts-debounce'
import {
  resolveElement,
  sleep
} from './utils'
import { BartenderError } from './BartenderError'
import { Bar } from './Bar'
import { PushElement } from './PushElement'

/**
 * Class for creating accessible off-canvas bars.
 */
export class Bartender {

  // TODO: prefix private features with #?

  /** @property {boolean} debug - Enable debug mode? */
  private _debug = false

  /** @property {HTMLElement} el - Main element */
  readonly el: HTMLElement

  /** @property {HTMLElement} contentEl - Content element */
  readonly contentEl: HTMLElement

  /** @property {number} switchTimeout - Time to wait in milliseconds until another bar is opened */
  readonly switchTimeout: number = 150

  /** @property {HTMLElement|null} fixedElementContainer - Reference to the fixed element container */
  readonly fixedElementContainer: HTMLElement | null = null

  /** @property {boolean} focusTrap - Enable focus trap? */
  readonly focusTrap: boolean = false

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

  /** @property {HTMLElement|null} previousOpenButton - Reference to the previous open button */
  private previousOpenButton?: HTMLElement | null = null

  /** @property {PushElement[]} pushableElements - Pushable elements added to the instance */
  private pushableElements: PushElement[] = []

  /** @property {object|null} trap - Focus trap */
  private trap: focusTrap.FocusTrap | null = null

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
    barOptions: BartenderBarOptions = {}
  ) {
    this.debug = options.debug ?? this._debug
    this.switchTimeout = options.switchTimeout ?? this.switchTimeout
    this.focusTrap = options.focusTrap ?? this.focusTrap
    this.barDefaultOptions = {
      ...this.barDefaultOptions,
      ...barOptions,
      focusTrap: this.focusTrap,
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
    this.addPushElement({
      el: this.contentEl,
      modes: [
        'push',
        'reveal',
      ],
    })

    // Fixed element container
    this.fixedElementContainer = resolveElement(
      options.fixedElementContainer || '.bartender__fixedElementContainer',
      this.el
    )

    // Create focus trap
    if (this.focusTrap === true) {
      const containerNodes: Array<HTMLElement | null> = [
        this.contentEl,
        this.fixedElementContainer,
      ].filter(item => !!item)

      this.trap = focusTrap.createFocusTrap(containerNodes as HTMLElement[], {
        initialFocus: this.contentEl,
        fallbackFocus: () => {
          return this.contentEl
        },
        escapeDeactivates: false,
        clickOutsideDeactivates: false,
        allowOutsideClick: false,
        returnFocusOnDeactivate: false,
        preventScroll: true,
      })
      this.trap.activate()
    }

    // Queue for actions
    this.queue = new Queue(1)

    // Debouncer for resizing
    this.resizeDebounce = debounce(() => {
      this.pushElements(this.getOpenBar())
    }, 100)

    // Event listeners
    this.onBarUpdateHandler = this.onBarUpdate.bind(this)
    window.addEventListener('bartender-bar-update', this.onBarUpdateHandler)

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

    // Destroy focus trap
    if (this.trap) this.trap.deactivate()

    // Remove event listeners
    window.removeEventListener('bartender-bar-update', this.onBarUpdateHandler)
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
   * @param {string} name - Unique name of the bar
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

    // Set debug mode for bar
    bar.debug = this.debug

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
    if (this.getOpenBar() === bar) await this.close()

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

    if (this.trap) this.trap.pause()
    this.el.classList.add('bartender--open')
    this.contentEl.setAttribute('aria-hidden', 'true')
    this.pushElements(bar)

    return bar.open()
  }

  /**
   * Open bar
   *
   * @param {string} name - Bar name
   * @param {HTMLElement|null} button - Reference to the element which was used to open the bar
   * @returns {Promise<Bar>}
   */
  public async open (name: string, button?: HTMLElement | null): Promise<Bar> {
    const id = Symbol()
    await this.queue.wait(id)

    // Store reference to the button which was used to open the bar.
    this.previousOpenButton = button

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

    // If we going to open right after closing the current one,
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

    if (this.trap) this.trap.unpause()

    return this.closeBar(name).finally(() => {
      this.queue.end(id)

      // Focus to the previous open button
      if (this.previousOpenButton) {
        this.previousOpenButton.focus()
        this.previousOpenButton = null
      } else {
        this.contentEl.focus()
      }
    })
  }

  /**
   * Toggle bar
   *
   * @param {string} name - Bar name
   * @param {HTMLElement|null} button - Reference to the element which was used to toggle the bar
   * @throws {BartenderError}
   * @returns {Promise<Bar|null>}
   */
  public async toggle (name: string, button?: HTMLElement | null): Promise<Bar | null> {
    const bar = this.getBar(name)
    if (!bar) throw new BartenderError(`Unknown bar '${name}'`)

    return (bar.isOpen() === true) ? this.close() : this.open(name, button)
  }

  /**
   * Add a new pushable element
   *
   * @param {object} options - Options for pushable element
   * @returns {PushElement}
   */
  public addPushElement (options: BartenderPushElementOptions = {}): PushElement {
    const pushElement = new PushElement(options)
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
   * Handler for bartender-bar-update event
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
