import type {
  BartenderBarOptions,
  BartenderBarPosition,
  BartenderBarMode,
  BartenderPushStyles,
  BartenderTransitionProperties
} from './types'
import { BartenderError } from './BartenderError'
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

  /** @property {string} _name - Bar name */
  private _name = ''

  /** @property {HTMLDialogElement} el - Bar element */
  public readonly el: HTMLDialogElement

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

  /** @property {boolean} isOpened - Is the bar currently open? */
  private isOpened = false

  /** @property {Function} onCloseHandler - Handler for dialog close event */
  private onCloseHandler

  /** @property {Function} onClickHandler - Handler for dialog click event */
  private onClickHandler

  /**
   * Create a new bar
   *
   * @param {string} name - Unique name of the bar
   * @param {object} options - Bar options
   * @throws {BartenderError}
   */
  constructor (name: string, options: BartenderBarOptions = {}) {
    if (!name) throw new BartenderError('Bar name is required')
    this.name = name

    // Get element
    const el = resolveElement(options.el || null) as HTMLDialogElement
    if (!el) throw new BartenderError(`Content element for bar '${this.name}' is required`)

    // Check that element is a dialog
    if (el.tagName !== 'DIALOG') throw new BartenderError(`Bar element for '${this.name}' must be a <dialog> element`)

    this.el = el
    this.el.classList.add('bartender__bar', 'bartender__bar--closed')

    this.position = options.position ?? this._position
    this.mode = options.mode ?? this._mode
    this.overlay = options.overlay ?? this._overlay
    this.permanent = options.permanent ?? this._permanent
    this.scrollTop = options.scrollTop ?? this._scrollTop

    // Event listeners
    this.onCloseHandler = this.onClose.bind(this)
    this.el.addEventListener('close', this.onCloseHandler)

    this.onClickHandler = this.onClick.bind(this)
    this.el.addEventListener('click', this.onClickHandler)

    this.initialized = true
  }

  /**
   * Destroy bar instance
   *
   * @returns {this}
   */
  public destroy (): this {
    this.el.classList.remove('bartender__bar', `bartender__bar--${this.position}`)

    this.el.removeEventListener('close', this.onCloseHandler)
    this.el.removeEventListener('click', this.onClickHandler)

    return this
  }

  /** @type {string} */
  public get name () {
    return this._name
  }

  /** @type {string} */
  public set name (val: string) {
    this._name = val

    if (this.initialized === false) return

    this.el.dispatchEvent(new CustomEvent('bartender-bar-updated', {
      bubbles: true,
      detail: {
        bar: this,
        property: 'name',
        value: val,
      },
    }))

    if (this.debug) console.debug('Updated bar name', this)
  }

  /** @type {string} */
  public get position () {
    return this._position
  }

  /**
   * @type {string}
   * @throws {BartenderError}
   */
  public set position (val: BartenderBarPosition) {
    // Validate position
    if (!val) throw new BartenderError(`Position is required for bar '${this.name}'`)

    const validPositions: BartenderBarPosition[] = [
      'left',
      'right',
      'top',
      'bottom',
    ]

    if (!validPositions.includes(val)) throw new BartenderError(`Invalid position '${val}' for bar '${this.name}'. Use one of the following: ${validPositions.join(', ')}.`)

    // Update element classes
    this.el.classList.remove(`bartender__bar--${this._position}`)
    this.el.classList.add(`bartender__bar--${val}`)

    // Set new position
    this._position = val

    if (this.initialized === false) return

    // If position was changed after bar was created,
    // dispatch event to update pushable elements
    this.el.dispatchEvent(new CustomEvent('bartender-bar-updated', {
      bubbles: true,
      detail: {
        bar: this,
        property: 'position',
        value: val,
      },
    }))

    if (this.debug) console.debug('Updated bar position', this)
  }

  /** @type {string} */
  public get mode () {
    return this._mode
  }

  /**
   * @type {string}
   * @throws {BartenderError}
   */
  public set mode (val: BartenderBarMode) {
    // Validate mode
    if (!val) throw new BartenderError(`Mode is required for bar '${this.name}'`)

    const validModes: BartenderBarMode[] = [
      'float',
      'push',
    ]

    if (!validModes.includes(val)) throw new BartenderError(`Invalid mode '${val}' for bar '${this.name}'. Use one of the following: ${validModes.join(', ')}.`)

    // Update element classes
    this.el.classList.remove(`bartender__bar--${this._mode}`)
    this.el.classList.add(`bartender__bar--${val}`)

    // Set new mode
    this._mode = val

    if (this.initialized === false) return

    // If mode was changed after bar was created,
    // dispatch event to update pushable elements
    this.el.dispatchEvent(new CustomEvent('bartender-bar-updated', {
      bubbles: true,
      detail: {
        bar: this,
        property: 'mode',
        value: this._mode,
      },
    }))

    if (this.debug) console.debug('Updated bar mode', this)
  }

  /** @type {boolean} */
  public get overlay () {
    return this._overlay
  }

  /** @type {boolean} */
  public set overlay (val: boolean) {
    this._overlay = val

    if (val === true) {
      this.el.classList.add('bartender__bar--overlay')
    } else {
      this.el.classList.remove('bartender__bar--overlay')
    }

    if (this.initialized === false) return

    this.el.dispatchEvent(new CustomEvent('bartender-bar-updated', {
      bubbles: true,
      detail: {
        bar: this,
        property: 'overlay',
        value: val,
      },
    }))

    if (this.debug) console.debug('Updated bar overlay', this)
  }

  /** @type {boolean} */
  public get permanent () {
    return this._permanent
  }

  /** @type {boolean} */
  public set permanent (val: boolean) {
    this._permanent = val

    if (this.initialized === false) return

    this.el.dispatchEvent(new CustomEvent('bartender-bar-updated', {
      bubbles: true,
      detail: {
        bar: this,
        property: 'permanent',
        value: val,
      },
    }))

    if (this.debug) console.debug('Updated bar permanence', this)
  }

  /** @type {boolean} */
  public get scrollTop () {
    return this._scrollTop
  }

  /** @type {boolean} */
  public set scrollTop (val: boolean) {
    this._scrollTop = val

    if (this.initialized === false) return

    this.el.dispatchEvent(new CustomEvent('bartender-bar-updated', {
      bubbles: true,
      detail: {
        bar: this,
        property: 'scrollTop',
        value: val,
      },
    }))

    if (this.debug) console.debug('Updated bar scrollTop', this)
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
   * Get transition properties for an element
   *
   * @param {Element} el - Element to get properties for
   * @returns {BartenderTransitionProperties}
   */
  public getTransitionProperties (el: Element): BartenderTransitionProperties | null {
    if (!el) return null

    const properties: BartenderTransitionProperties = {
      timingFunction: undefined,
      duration: 0,
    }

    const transitionProperties = window.getComputedStyle(el).getPropertyValue('transition-property') || ''
    const transitionDurations = window.getComputedStyle(el).getPropertyValue('transition-duration') || ''
    const transitionTimingFunctions = window.getComputedStyle(el).getPropertyValue('transition-timing-function') || ''

    // Find out index for transform
    const transformIndex = transitionProperties.split(',').map(item => item.trim()).indexOf('transform')
    if (transformIndex < 0) return properties

    // Get duration of transform
    const duration = transitionDurations.split(',').map(item => item.trim())[transformIndex]
    if (duration) {
      properties.duration = parseFloat(duration) * 1000
    }

    // Get timing function of transform
    const timingFunction = transitionTimingFunctions.split(',').map(item => item.trim())[transformIndex]
    if (timingFunction) {
      properties.timingFunction = timingFunction
    }

    return properties
  }

  /**
   * Open bar
   *
   * @returns {Promise<this>}
   */
  public async open (): Promise<this> {
    if (this.debug) console.debug('Opening bar', this)

    // Dispatch 'before open' event
    this.el.dispatchEvent(new CustomEvent('bartender-bar-before-open', {
      bubbles: true,
      detail: { bar: this },
    }))

    this.el.showModal()
    if (this.scrollTop === true) this.el.scrollTo(0, 0)
    this.el.classList.remove('bartender__bar--closed')
    this.el.classList.add('bartender__bar--open')
    this.isOpened = true

    await sleep(this.getTransitionProperties(this.el)?.duration)

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
  public async close (): Promise<this> {
    this.el.close()

    await sleep(this.getTransitionProperties(this.el)?.duration)

    return Promise.resolve(this)
  }

  /**
   * Handler for dialog close event
   *
   * @returns {Promise<this>}
   */
  private async onClose (): Promise<this> {
    if (this.debug) console.debug('Closing bar', this)

    this.el.dispatchEvent(new CustomEvent('bartender-bar-before-close', {
      bubbles: true,
      detail: { bar: this },
    }))

    this.el.classList.remove('bartender__bar--open')
    this.isOpened = false

    await sleep(this.getTransitionProperties(this.el)?.duration)

    this.el.classList.add('bartender__bar--closed')

    this.el.dispatchEvent(new CustomEvent('bartender-bar-after-close', {
      bubbles: true,
      detail: { bar: this },
    }))

    if (this.debug) console.debug('Finished closing bar', this)

    return Promise.resolve(this)
  }

  /**
   * Handler for dialog click event
   *
   * @param {MouseEvent} event - Click event
   * @returns {Promise<this>}
   */
  private onClick (event: MouseEvent): Promise<this> {
    const rect = this.el.getBoundingClientRect()

    // Detect clicking on backdrop
    if (
      this.permanent === false && (
        rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY
      )
    ) {
      this.close()
    }

    return Promise.resolve(this)
  }

  /**
   * Get styles for pushable elements
   *
   * @returns {Promise<BartenderPushStyles>}
   */
  public async getPushStyles (): Promise<BartenderPushStyles> {
    const styles: BartenderPushStyles = {
      transform: '',
      transitionDuration: '',
      transitionTimingFunction: '',
    }

    if (!this.position || !this.el) {
      return styles
    }

    await new Promise((resolve) => requestAnimationFrame(resolve))

    styles.transform = {
      left: `translateX(${this.el.offsetWidth}px)`,
      right: `translateX(-${this.el.offsetWidth}px)`,
      top: `translateY(${this.el.offsetHeight}px)`,
      bottom: `translateY(-${this.el.offsetHeight}px)`,
    }[this.position] || ''

    const transitionProperties = this.getTransitionProperties(this.el)
    if (!transitionProperties) return styles

    styles.transitionDuration = `${transitionProperties.duration}ms`
    styles.transitionTimingFunction = transitionProperties.timingFunction || ''

    return Promise.resolve(styles)
  }
}
