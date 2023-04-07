import type {
  BartenderPushElementOptions,
  BartenderBarMode,
  BartenderPushStyles,
  BartenderBarPosition
} from './types'
import { BartenderError } from './BartenderError'
import { Bar } from './Bar'
import { resolveElement } from './utils'

/**
 * Bartender pushable element
 */
export class PushElement {

  /** @property {HTMLElement} el - Element to push */
  private el: HTMLElement

  /** @property {Bar[]} bars - Matched bars */
  readonly bars: Bar[]

  /** @property {string[]} modes - Matched modes */
  readonly modes: BartenderBarMode[]

  /** @property {string[]} positions - Matched positions */
  readonly positions: BartenderBarPosition[]

  /** @property {boolean} isPushed - Is the element currently pushed? */
  private isPushed = false

  /**
   * Create a new pushable element
   *
   * @param {object} options - Options for pushable element
   * @throws {BartenderError}
   */
  constructor (options: BartenderPushElementOptions = {}) {
    // Get element
    const el = resolveElement(options.el || null)
    if (!el) throw new BartenderError('Element is required for push element')
    this.el = el

    this.bars = options.bars || []
    this.modes = options.modes || []
    this.positions = options.positions || []
  }

  /**
   * Push element
   *
   * @param {Bar} bar - The bar to match against push element properties
   * @param {object} pushStyles - Push styles from the bar
   * @returns {this}
   */
  public push (bar: Bar, pushStyles: BartenderPushStyles): this {
    // If this element is not supposed to be pushed,
    // clear transition styles
    if (
      (this.bars.length && !this.bars.includes(bar)) ||
      (this.modes.length && !this.modes.includes(bar.mode)) ||
      (this.positions.length && !this.positions.includes(bar.position))
    ) {
      this.el.style.transform = ''
      this.el.style.transitionTimingFunction = ''
      this.el.style.transitionDuration = ''
      this.isPushed = false

      return this
    }

    this.el.style.transform = pushStyles.transform
    this.el.style.transitionTimingFunction = pushStyles.transitionTimingFunction
    this.el.style.transitionDuration = pushStyles.transitionDuration
    this.isPushed = true

    return this
  }

  /**
   * Pull element and return it to the original position
   *
   * @param {object} pushStyles - Push styles from the bar
   * @returns {this}
   */
  public pull (pushStyles: BartenderPushStyles): this {
    if (this.isPushed === false) return this

    this.el.style.transform = 'translateX(0) translateY(0)'
    this.el.style.transitionTimingFunction = pushStyles.transitionTimingFunction
    this.el.style.transitionDuration = pushStyles.transitionDuration
    this.isPushed = false

    return this
  }

}
