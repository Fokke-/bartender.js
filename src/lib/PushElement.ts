import type {
  BartenderElementQuery,
  BartenderPushElementOptions,
  BartenderPushStyles,
  BartenderBarPosition,
} from './types'
import { BartenderError } from './BartenderError'
import { Bar } from './Bar'
import { resolveElement } from './utils'

/**
 * Bartender pushable element
 */
export class PushElement {
  /** @property {HTMLElement} el - Element to push */
  public readonly el: HTMLElement

  /** @property {Bar[]} bars - Matched bars */
  private readonly bars: Bar[]

  /** @property {string[]} positions - Matched positions */
  private readonly positions: BartenderBarPosition[]

  /** @property {boolean} isPushed - Is the element currently pushed? */
  private isPushed = false

  /**
   * Create a new pushable element
   *
   * @param {BartenderElementQuery} el - Pushable element
   * @param {object} options - Options for pushable element
   * @throws {BartenderError}
   */
  constructor(
    el: BartenderElementQuery,
    options: BartenderPushElementOptions = {},
  ) {
    // Get element
    const element = resolveElement(el || null)
    if (!element)
      throw new BartenderError('Element is required for push element')

    this.el = element
    this.bars = options.bars || []
    this.positions = options.positions || []
  }

  /**
   * Push element
   *
   * @param {Bar} bar - The bar to match against push element properties
   * @param {object} pushStyles - Push styles from the bar
   * @returns {this}
   */
  public push(bar: Bar, pushStyles: BartenderPushStyles): this {
    // If this element is not supposed to be pushed,
    // clear transition styles
    if (
      (this.bars.length && !this.bars.includes(bar)) ||
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
  public pull(pushStyles: BartenderPushStyles): this {
    if (this.isPushed === false) return this

    this.el.style.transform = 'translateX(0) translateY(0)'
    this.el.style.transitionTimingFunction = pushStyles.transitionTimingFunction
    this.el.style.transitionDuration = pushStyles.transitionDuration
    this.isPushed = false

    return this
  }
}
