import type {
  BartenderBarOptions,
  BartenderBarPosition,
  BartenderBarMode,
  BartenderPushStyles
} from './Bartender.d'
import { BartenderError } from './BartenderError'
import { Overlay } from './Overlay'
import { resolveElement, sleep } from './utils'

export class Bar {
  // TODO: when mode changes, update pushable elements
  // TODO: when position changes, update pushable elements
  readonly overlayObj: Overlay
  private _name = ''
  readonly el?: HTMLElement | null
  private _position: BartenderBarPosition = 'left'
  private _mode: BartenderBarMode = 'float'
  private _overlay = true
  public permanent = false
  private isOpened = false

  constructor (name: string, options: BartenderBarOptions = {}) {
    if (!name) throw 'Bar name is required'

    this.overlayObj = new Overlay(name, this.overlay)
    this.name = name

    // Get element
    this.el = resolveElement(options.el, options.elSelector)
    if (!this.el) throw new BartenderError(`Content element for bar '${this.name}' is required`)
    this.el.classList.add('bartender__bar')

    this.mode = options.mode ?? this._mode
    this.position = options.position ?? this.position
    this.overlay = options.overlay ?? this._overlay
    this.permanent = options.permanent ?? this.permanent

    // Check that element is a direct child of the main element
    // TODO: do this elsewhere
    //if (this.el.parentElement !== this.bartender.mainEl) throw `Element of bar '${this.name}' must be a direct child of the Bartender main element`
  }

  get name () {
    return this._name
  }

  set name (name: string) {
    this._name = name
    this.overlayObj.name = name
  }

  get position () {
    return this._position
  }

  set position (position: BartenderBarPosition) {
    // Validate position
    if (!position) throw `Position is required for bar '${this.name}'`

    const validPositions = [
      'left',
      'right',
      'top',
      'bottom',
    ]

    if (!validPositions.includes(position)) throw `Invalid position '${position}' for bar '${this.name}'. Use one of the following: ${validPositions.join(', ')}.`

    // Temporarily disable transition
    if (this.el) this.el.style.transition = 'none'

    // Update element classes
    this.el?.classList.remove(`bartender__bar--${this.position}`)
    this.el?.classList.add(`bartender__bar--${position}`)

    this._position = position

    // Return transition
    setTimeout(() => {
      if (this.el) this.el.style.transition = ''
    })
  }

  get mode () {
    return this._mode
  }

  set mode (mode: BartenderBarMode) {
    // Validate mode
    if (!mode) throw `Mode is required for bar '${this.name}'`

    const validModes = [
      'float',
      'push',
      'reveal',
    ]

    if (!validModes.includes(mode)) throw `Invalid mode '${mode}' for bar '${this.name}'. Use one of the following: ${validModes.join(', ')}.`

    // Update element classes
    this.el?.classList.remove(`bartender__bar--${this.mode}`)
    this.el?.classList.add(`bartender__bar--${mode}`)

    this._mode = mode
  }

  get overlay () {
    return this._overlay
  }

  set overlay (val) {
    this.overlayObj.enabled = val
    this._overlay = val
  }

  public isOpen (): boolean {
    return this.isOpened
  }

  private getTransitionDuration (): number {
    if (!this.el) return 0

    const duration = window.getComputedStyle(this.el).getPropertyValue('transition-duration') || '0s'
    return parseFloat(duration) * 1000
  }

  async open () : Promise<this> {
    // Dispatch 'before open' event
    this.el?.dispatchEvent(new CustomEvent('bartender-bar-before-open', {
      bubbles: true,
      detail: {
        bar: this,
      },
    }))

    this.el?.classList.add('bartender__bar--open')
    this.isOpened = true

    await sleep(this.getTransitionDuration())

    // Dispatch 'after open' event
    this.el?.dispatchEvent(new CustomEvent('bartender-bar-after-open', {
      bubbles: true,
      detail: {
        bar: this,
      },
    }))

    return Promise.resolve(this)
  }

  async close () : Promise<this> {
    this.el?.dispatchEvent(new CustomEvent('bartender-bar-before-close', {
      bubbles: true,
      detail: {
        bar: this,
      },
    }))

    this.el?.classList.remove('bartender__bar--open')
    this.isOpened = false

    await sleep(this.getTransitionDuration())

    this.el?.dispatchEvent(new CustomEvent('bartender-bar-after-close', {
      bubbles: true,
      detail: {
        bar: this,
      },
    }))

    return Promise.resolve(this)
  }

  getPushStyles (): BartenderPushStyles | null {
    if (!this.position || !this.el) return null

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
