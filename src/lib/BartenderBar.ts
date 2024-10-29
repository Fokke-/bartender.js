import type {
  BartenderBarOptions,
  BartenderBarPosition,
  BartenderOpenOptions,
} from './types'
import { BartenderError } from './BartenderError'
import { resolveElement, sleep } from './utils'

/**
 * Bartender bar
 */
export class BartenderBar {
  /** Enable debug mode? */
  public debug = false

  /** Is bar initialized? */
  private initialized = false

  /** Bar name */
  private _name = ''

  /** Bar element */
  public readonly el: HTMLDialogElement

  /** Bar position */
  private _position: BartenderBarPosition = 'left'

  /** Enable overlay? */
  private _overlay = true

  /** Enable permanent mode? */
  private _permanent = false

  /** Scroll to the top when bar is opened? */
  private _scrollTop = true

  /** Is the bar currently open? */
  private isOpened = false

  /** Is the bar opened in modal mode? */
  public isModal = true

  /** Handler for dialog close event */
  private onCloseHandler

  /** Handler for dialog click event */
  private onClickHandler

  /**
   * Create a new bar
   */
  constructor(name: string, options: BartenderBarOptions = {}) {
    if (!name) {
      throw new BartenderError('Bar name is required')
    }
    this.name = name

    // Get element
    const el = resolveElement(options.el || null) as HTMLDialogElement

    if (!el) {
      throw new BartenderError(`Element for bar '${this.name}' is required`)
    }

    if (el.tagName !== 'DIALOG') {
      throw new BartenderError(
        `Bar element for '${this.name}' must be a <dialog> element`,
      )
    }

    this.el = el
    this.el.classList.add('bartender-bar', 'bartender-bar--closed')

    this.position = options.position ?? this._position
    this.overlay = options.overlay ?? this._overlay
    this.permanent = options.permanent ?? this._permanent
    this.scrollTop = options.scrollTop ?? this._scrollTop

    // Handler for close events
    this.onCloseHandler = async (_event: Event): Promise<void> => {
      if (this.debug) {
        console.debug('Closing bar', this)
      }

      this.el.dispatchEvent(
        new CustomEvent('bartender-bar-before-close', {
          bubbles: true,
          detail: { bar: this },
        }),
      )

      this.el.classList.remove('bartender-bar--open')
      this.isOpened = false

      await sleep(this.getTransitionDuration())
      this.el.classList.add('bartender-bar--closed')

      this.el.dispatchEvent(
        new CustomEvent('bartender-bar-after-close', {
          bubbles: true,
          detail: { bar: this },
        }),
      )

      if (this.debug) {
        console.debug('Finished closing bar', this)
      }
    }

    // Handler for click events
    this.onClickHandler = (event: MouseEvent): void => {
      const rect = this.el.getBoundingClientRect()

      // Detect clicking on backdrop
      if (
        this.permanent === false &&
        (rect.left > event.clientX ||
          rect.right < event.clientX ||
          rect.top > event.clientY ||
          rect.bottom < event.clientY)
      ) {
        event.stopPropagation()

        this.el.dispatchEvent(
          new CustomEvent('bartender-bar-backdrop-click', {
            bubbles: true,
            detail: {
              bar: this,
            },
          }),
        )
      }
    }

    // Add event listeners
    this.el.addEventListener('close', this.onCloseHandler as EventListener)
    this.el.addEventListener('click', this.onClickHandler as EventListener)

    this.initialized = true
  }

  /**
   * Destroy bar instance
   */
  public destroy(): this {
    this.el.classList.remove(
      'bartender-bar',
      `bartender-bar--position-${this.position}`,
    )

    this.el.removeEventListener('close', this.onCloseHandler)
    this.el.removeEventListener('click', this.onClickHandler)

    return this
  }

  /** Bar name */
  public get name() {
    return this._name
  }

  public set name(val: string) {
    this._name = val

    if (this.initialized === false) {
      return
    }

    this.el.dispatchEvent(
      new CustomEvent('bartender-bar-updated', {
        bubbles: true,
        detail: {
          bar: this,
          property: 'name',
          value: val,
        },
      }),
    )

    if (this.debug) {
      console.debug('Updated bar name', this)
    }
  }

  /** Bar position */
  public get position() {
    return this._position
  }

  public set position(val: BartenderBarPosition) {
    // Validate position
    if (!val) {
      throw new BartenderError(`Position is required for bar '${this.name}'`)
    }

    const validPositions: BartenderBarPosition[] = [
      'left',
      'right',
      'top',
      'bottom',
    ]

    if (!validPositions.includes(val)) {
      throw new BartenderError(
        `Invalid position '${val}' for bar '${this.name}'. Use one of the following: ${validPositions.join(', ')}.`,
      )
    }

    // Update element classes
    this.el.classList.remove(`bartender-bar--position-${this._position}`)
    this.el.classList.add(`bartender-bar--position-${val}`)

    // Set new position
    this._position = val

    if (this.initialized === false) {
      return
    }

    // If position was changed after bar was created,
    // dispatch event to update pushable elements
    this.el.dispatchEvent(
      new CustomEvent('bartender-bar-updated', {
        bubbles: true,
        detail: {
          bar: this,
          property: 'position',
          value: val,
        },
      }),
    )

    if (this.debug) {
      console.debug('Updated bar position', this)
    }
  }

  /** Enable overlay? */
  public get overlay() {
    return this._overlay
  }

  public set overlay(val: boolean) {
    this._overlay = val

    if (val === true) {
      this.el.classList.add('bartender-bar--has-overlay')
    } else {
      this.el.classList.remove('bartender-bar--has-overlay')
    }

    if (this.initialized === false) {
      return
    }

    this.el.dispatchEvent(
      new CustomEvent('bartender-bar-updated', {
        bubbles: true,
        detail: {
          bar: this,
          property: 'overlay',
          value: val,
        },
      }),
    )

    if (this.debug) {
      console.debug('Updated bar overlay', this)
    }
  }

  /** Enable permanent mode? */
  public get permanent() {
    return this._permanent
  }

  public set permanent(val: boolean) {
    this._permanent = val

    if (this.initialized === false) return

    this.el.dispatchEvent(
      new CustomEvent('bartender-bar-updated', {
        bubbles: true,
        detail: {
          bar: this,
          property: 'permanent',
          value: val,
        },
      }),
    )

    if (this.debug) {
      console.debug('Updated bar permanence', this)
    }
  }

  /** Scroll to the top when bar is opened? */
  public get scrollTop() {
    return this._scrollTop
  }

  public set scrollTop(val: boolean) {
    this._scrollTop = val

    if (this.initialized === false) return

    this.el.dispatchEvent(
      new CustomEvent('bartender-bar-updated', {
        bubbles: true,
        detail: {
          bar: this,
          property: 'scrollTop',
          value: val,
        },
      }),
    )

    if (this.debug) {
      console.debug('Updated bar scrollTop', this)
    }
  }

  /**
   * Is bar currently open?
   */
  public isOpen(): boolean {
    return this.isOpened
  }

  /**
   * Open bar
   */
  public async open(options: BartenderOpenOptions = {}): Promise<this> {
    this.isModal = !!options.modal

    // Dispatch 'before open' event
    this.el.dispatchEvent(
      new CustomEvent('bartender-bar-before-open', {
        bubbles: true,
        detail: { bar: this },
      }),
    )

    if (this.debug) {
      console.debug('Opening bar', this)
    }

    if (this.isModal === true) {
      this.el.showModal()
    } else {
      this.el.show()
    }

    if (this.scrollTop === true) {
      this.scrollToTop()
    }

    this.el.classList.remove('bartender-bar--closed')
    this.el.classList.add('bartender-bar--open')
    this.isOpened = true

    await sleep(this.getTransitionDuration())

    if (this.debug) {
      console.debug('Finished opening bar', this)
    }

    // Dispatch 'after open' event
    this.el.dispatchEvent(
      new CustomEvent('bartender-bar-after-open', {
        bubbles: true,
        detail: { bar: this },
      }),
    )

    return this
  }

  /**
   * Close bar
   */
  public async close(): Promise<this> {
    this.el.close()

    await sleep(this.getTransitionDuration())

    return this
  }

  /**
   * Scroll bar to the top
   */
  public scrollToTop(): this {
    this.el.scrollTo(0, 0)

    return this
  }

  /**
   * Get transition duration in milliseconds
   */
  public getTransitionDuration(): number {
    return (
      parseFloat(window.getComputedStyle(this.el).transitionDuration || '0') *
      1000
    )
  }
}
