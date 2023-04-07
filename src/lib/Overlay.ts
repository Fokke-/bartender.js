import { BartenderError } from './BartenderError'

/**
 * Bartender overlay
 */
export class Overlay {

  /** @property {boolean} _name - Overlay object name */
  private _name = ''

  /** @property {boolean} _enabled - Enable overlay? */
  private _enabled = true

  /** @property {HTMLElement} el - Overlay element */
  readonly el: HTMLElement

  /**
   * Create a new overlay
   *
   * @param {string} name - Overlay object name
   * @param {boolean} enabled - Enable overlay?
   */
  constructor (name: string, enabled = true) {
    this.el = document.createElement('div')
    this.el.classList.add('bartender__overlay')

    try {
      this.name = name
    } catch (error) {
      if (error instanceof DOMException) throw new BartenderError(`Name '${name}' is not valid HTML class name`)

      throw new BartenderError(error as string)
    }

    this.enabled = enabled
  }

  /**
   * Destroy overlay instance
   *
   * @returns {this}
   */
  public destroy (): this {
    this.el.remove()

    return this
  }

  /** @type {string} */
  public get name () {
    return this._name
  }

  /** @type {string} */
  public set name (name: string) {
    this.el.classList.remove(`bartender__overlay--${this._name}`)
    this.el.classList.add(`bartender__overlay--${name}`)
    this._name = name
  }

  /** @type {boolean} */
  public get enabled () {
    return this._enabled
  }

  /** @type {boolean} */
  public set enabled (val: boolean) {
    if (val === true) {
      this.el.classList.remove('bartender__overlay--transparent')
    } else {
      this.el.classList.add('bartender__overlay--transparent')
    }

    this._enabled = val
  }

  /**
   * Show overlay
   *
   * @returns {this}
   */
  public show (): this {
    this.el.classList.add('bartender__overlay--visible')

    return this
  }

  /**
   * Hide overlay
   *
   * @returns {this}
   */
  public hide (): this {
    this.el.classList.remove('bartender__overlay--visible')

    return this
  }

}
