import type {
  BartenderBarOptions,
  BartenderBarPosition,
  BartenderBarMode,
  BartenderPushStyles
} from './types'
import * as focusTrap from 'focus-trap'
import { BartenderError } from './BartenderError'
import { Overlay } from './Overlay'
import {
  resolveElement,
  sleep
} from './utils'

/**
 * Bartender bar
 */
export class Bar {
  /** @property {boolean} debug - Enable debug mode? */
  public debug = false

  /** @property {boolean} initialized - Is bar initialized? */
  private initialized = false

  /** @property {Overlay} overlayObj - Overlay object for the bar */
  readonly overlayObj: Overlay

  /** @property {string} _name - Bar name */
  private _name = ''

  /** @property {HTMLElement} el - Bar element */
  readonly el: HTMLElement

  /** @property {string} _position - Bar position */
  private _position: BartenderBarPosition = 'left'

  /** @property {string} _mode - Bar mode */
  private _mode: BartenderBarMode = 'float'

  /** @property {boolean} _overlay - Enable overlay? */
  private _overlay = true

  /** @property {boolean} _permanent - Enable permanent mode? */
  private _permanent = false

  /** @property {boolean} _scrollTop - Scroll to the top when bar is opened? */
  private _scrollTop = true

  /** @property {boolean} focusTrap - Enable focus trap? */
  private focusTrap = false

  /** @property {boolean} isOpened - Is the bar currently open? */
  private isOpened = false

  /** @property {object|null} trap - Focus trap */
  private trap: focusTrap.FocusTrap | null = null

  /**
   * Create a new bar
   *
   * @param {string} name - Unique name of the bar
   * @param {object} options - Bar options
   * @throws {BartenderError}
   */
  constructor (name: string, options: BartenderBarOptions = {}) {
    if (!name) throw new BartenderError('Bar name is required')

    this.overlayObj = new Overlay(name, this.overlay)
    this.name = name

    // Get element
    const el = resolveElement(options.el || null)
    if (!el) throw new BartenderError(`Content element for bar '${this.name}' is required`)
    this.el = el
    this.el.classList.add('bartender__bar')
    this.el.setAttribute('tabindex', '-1')
    this.el.setAttribute('aria-hidden', 'true')

    this.position = options.position ?? this._position
    this.mode = options.mode ?? this._mode
    this.overlay = options.overlay ?? this._overlay
    this.permanent = options.permanent ?? this._permanent
    this.scrollTop = options.scrollTop ?? this._scrollTop
    this.focusTrap = options.focusTrap ?? this.focusTrap

    if (this.focusTrap === true) {
      this.trap = focusTrap.createFocusTrap(this.el, {
        initialFocus: this.el,
        fallbackFocus: () => {
          return this.el
        },
        escapeDeactivates: false,
        clickOutsideDeactivates: false,
        allowOutsideClick: true,
        returnFocusOnDeactivate: false,
        preventScroll: true,
      })
    }

    this.initialized = true
  }

  /**
   * Destroy bar instance
   *
   * @returns {this}
   */
  destroy (): this {
    if (this.trap) this.trap.deactivate()
    this.overlayObj.destroy()
    this.el.classList.remove('bartender__bar', `bartender__bar--${this.position}`)

    return this
  }

  /** @type {string} */
  get name () {
    return this._name
  }

  /** @type {string} */
  set name (name: string) {
    this._name = name
    this.overlayObj.name = name
  }

  /** @type {string} */
  get position () {
    return this._position
  }

  /**
   * @type {string}
   * @throws {BartenderError}
   */
  set position (position: BartenderBarPosition) {
    // Validate position
    if (!position) throw new BartenderError(`Position is required for bar '${this.name}'`)

    const validPositions = [
      'left',
      'right',
      'top',
      'bottom',
    ]

    if (!validPositions.includes(position)) throw new BartenderError(`Invalid position '${position}' for bar '${this.name}'. Use one of the following: ${validPositions.join(', ')}.`)
    if (this.initialized === true && this.position === position) return

    // Temporarily disable transition
    this.el.classList.add('bartender-disable-transition')

    // Update element classes
    this.el.classList.remove(`bartender__bar--${this.position}`)
    this.el.classList.add(`bartender__bar--${position}`)

    // Set new position
    this._position = position

    // Return transition
    setTimeout(() => {
      this.el.classList.remove('bartender-disable-transition')
    })

    // If position was changed after bar was created,
    // dispatch event to update pushable elements
    if (this.initialized === true) {
      this.el.dispatchEvent(new CustomEvent('bartender-bar-update', {
        bubbles: true,
        detail: { bar: this },
      }))

      if (this.debug) console.debug('Updated bar position', this)
    }
  }

  /** @type {string} */
  get mode () {
    return this._mode
  }

  /**
   * @type {string}
   * @throws {BartenderError}
   */
  set mode (mode: BartenderBarMode) {
    // Validate mode
    if (!mode) throw new BartenderError(`Mode is required for bar '${this.name}'`)

    const validModes = [
      'float',
      'push',
      'reveal',
    ]

    if (!validModes.includes(mode)) throw new BartenderError(`Invalid mode '${mode}' for bar '${this.name}'. Use one of the following: ${validModes.join(', ')}.`)
    if (this.initialized === true && this.mode === mode) return

    // Temporarily disable transition
    this.el.classList.add('bartender-disable-transition')

    // Update element classes
    this.el.classList.remove(`bartender__bar--${this.mode}`)
    this.el.classList.add(`bartender__bar--${mode}`)

    // Set new mode
    this._mode = mode

    // Return transition
    setTimeout(() => {
      this.el.classList.remove('bartender-disable-transition')
    })

    // If mode was changed after bar was created,
    // dispatch event to update pushable elements
    if (this.initialized === true) {
      this.el.dispatchEvent(new CustomEvent('bartender-bar-update', {
        bubbles: true,
        detail: { bar: this },
      }))

      if (this.debug) console.debug('Updated bar mode', this)
    }
  }

  /** @type {boolean} */
  get overlay () {
    return this._overlay
  }

  /** @type {boolean} */
  set overlay (val: boolean) {
    if (this.initialized === true && this.overlay === val) return

    this.overlayObj.enabled = val
    this._overlay = val

    if (this.initialized === true) {
      this.el.dispatchEvent(new CustomEvent('bartender-bar-update', {
        bubbles: true,
        detail: { bar: this },
      }))

      if (this.debug) console.debug('Updated bar overlay', this, this.overlayObj)
    }
  }

  /** @type {boolean} */
  get permanent () {
    return this._permanent
  }

  /** @type {boolean} */
  set permanent (val: boolean) {
    this._permanent = val

    if (this.initialized === true) this.el.dispatchEvent(new CustomEvent('bartender-bar-update', {
      bubbles: true,
      detail: { bar: this },
    }))
  }

  /** @type {boolean} */
  get scrollTop () {
    return this._scrollTop
  }

  /** @type {boolean} */
  set scrollTop (val: boolean) {
    this._scrollTop = val

    if (this.initialized === true) this.el.dispatchEvent(new CustomEvent('bartender-bar-update', {
      bubbles: true,
      detail: { bar: this },
    }))
  }

  /**
   * Is bar currently open?
   *
   * @returns {boolean}
   */
  public isOpen (): boolean {
    return this.isOpened
  }

  /**
   * Get transition duration in milliseconds
   *
   * @returns {number}
   */
  public getTransitionDuration (): number {
    if (!this.el) return 0

    const duration = window.getComputedStyle(this.el).getPropertyValue('transition-duration') || '0s'
    return parseFloat(duration) * 1000
  }

  /**
   * Open bar
   *
   * @returns {Promise<this>}
   */
  async open (): Promise<this> {
    if (this.debug) console.debug('Opening bar', this)

    // Dispatch 'before open' event
    this.el.dispatchEvent(new CustomEvent('bartender-bar-before-open', {
      bubbles: true,
      detail: { bar: this },
    }))

    if (this.scrollTop === true) this.el.scrollTo(0, 0)
    this.el.classList.add('bartender__bar--open')
    this.el.setAttribute('aria-hidden', 'false')
    this.el.focus()
    this.overlayObj.show()
    this.isOpened = true

    if (this.trap) this.trap.activate()

    await sleep(this.getTransitionDuration())

    // Dispatch 'after open' event
    this.el.dispatchEvent(new CustomEvent('bartender-bar-after-open', {
      bubbles: true,
      detail: { bar: this },
    }))

    if (this.debug) console.debug('Finished opening bar', this)

    return Promise.resolve(this)
  }

  /**
   * Close bar
   *
   * @returns {Promise<this>}
   */
  async close (): Promise<this> {
    if (this.debug) console.debug('Closing bar', this)

    this.el.dispatchEvent(new CustomEvent('bartender-bar-before-close', {
      bubbles: true,
      detail: { bar: this },
    }))

    this.el.classList.remove('bartender__bar--open')
    this.el.setAttribute('aria-hidden', 'true')
    this.overlayObj.hide()
    this.isOpened = false
    if (this.trap) this.trap.deactivate()

    await sleep(this.getTransitionDuration())

    this.el.dispatchEvent(new CustomEvent('bartender-bar-after-close', {
      bubbles: true,
      detail: { bar: this },
    }))

    if (this.debug) console.debug('Finished closing bar', this)

    return Promise.resolve(this)
  }

  /**
   * Get styles for pushable elements
   *
   * @returns {object}
   */
  getPushStyles (): BartenderPushStyles {
    if (!this.position || !this.el) {
      return {
        transform: '',
        transitionDuration: '',
        transitionTimingFunction: '',
      }
    }

    return {
      transform: {
        left: `translateX(${this.el.offsetWidth}px)`,
        right: `translateX(-${this.el.offsetWidth}px)`,
        top: `translateY(${this.el.offsetHeight}px)`,
        bottom: `translateY(-${this.el.offsetHeight}px)`,
      }[this.position] || '',
      transitionDuration: window.getComputedStyle(this.el).getPropertyValue('transition-duration') || '',
      transitionTimingFunction: window.getComputedStyle(this.el).getPropertyValue('transition-timing-function') || '',
    }
  }
}
