import type {
  BartenderBarOptions,
  BartenderBarPosition,
  BartenderBarMode,
  BartenderPushStyles
} from './types'
import { BartenderError } from './BartenderError'
import { Overlay } from './Overlay'
import {
  resolveElement,
  sleep
} from './utils'

export class Bar {
  private ready = false
  readonly overlayObj: Overlay
  private _name = ''
  readonly el: HTMLElement
  private _position: BartenderBarPosition = 'left'
  private _mode: BartenderBarMode = 'float'
  private _overlay = true
  public permanent = false
  public scrollTop = true
  private isOpened = false

  constructor (name: string, options: BartenderBarOptions = {}) {
    if (!name) throw 'Bar name is required'

    this.overlayObj = new Overlay(name, this.overlay)
    this.name = name

    // Get element
    const el = resolveElement(options.el || null)
    if (!el) throw new BartenderError(`Content element for bar '${this.name}' is required`)
    this.el = el
    this.el.classList.add('bartender__bar')

    this.position = options.position ?? this.position
    this.mode = options.mode ?? this._mode
    this.overlay = options.overlay ?? this._overlay
    this.permanent = options.permanent ?? this.permanent
    this.scrollTop = options.scrollTop ?? this.scrollTop

    this.ready = true
  }

  destroy (removeElement = false): this {
    if (removeElement === true) this.el.remove()
    this.overlayObj.destroy()

    return this
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
    this.el.classList.remove(`bartender__bar--${this.position}`)
    this.el.classList.add(`bartender__bar--${position}`)

    // Set new position
    this._position = position

    // Return transition
    setTimeout(() => {
      if (this.el) this.el.style.transition = ''
    })

    // If position was changed after bar was created,
    // dispatch resize event to update pushable elements
    if (this.ready === true) window.dispatchEvent(new Event('resize'))
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
    this.el.classList.remove(`bartender__bar--${this.mode}`)
    this.el.classList.add(`bartender__bar--${mode}`)

    // Set new mode
    this._mode = mode

    // If mode was changed after bar was created,
    // dispatch resize event to update pushable elements
    if (this.ready === true) window.dispatchEvent(new Event('resize'))
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

  public getTransitionDuration (): number {
    if (!this.el) return 0

    const duration = window.getComputedStyle(this.el).getPropertyValue('transition-duration') || '0s'
    return parseFloat(duration) * 1000
  }

  async open (): Promise<this> {
    // Dispatch 'before open' event
    this.el.dispatchEvent(new CustomEvent('bartender-bar-before-open', {
      bubbles: true,
      detail: { bar: this },
    }))

    if (this.scrollTop === true) this.el.scrollTo(0, 0)
    this.el.classList.add('bartender__bar--open')
    this.overlayObj.show()
    this.isOpened = true

    await sleep(this.getTransitionDuration())

    // Dispatch 'after open' event
    this.el.dispatchEvent(new CustomEvent('bartender-bar-after-open', {
      bubbles: true,
      detail: { bar: this },
    }))

    return Promise.resolve(this)
  }

  async close (): Promise<this> {
    this.el.dispatchEvent(new CustomEvent('bartender-bar-before-close', {
      bubbles: true,
      detail: { bar: this },
    }))

    this.el.classList.remove('bartender__bar--open')
    this.overlayObj.hide()
    this.isOpened = false

    await sleep(this.getTransitionDuration())

    this.el.dispatchEvent(new CustomEvent('bartender-bar-after-close', {
      bubbles: true,
      detail: { bar: this },
    }))

    return Promise.resolve(this)
  }

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
