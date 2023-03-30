import type {
  BartenderPushElementOptions,
  BartenderBarMode,
  BartenderPushStyles
} from './Bartender.d'
import { BartenderError } from './BartenderError'
import { Bar } from './Bar'
import { resolveElement } from './utils'

export class PushElement {
  private el?: HTMLElement | null
  readonly bars: Array<Bar>
  readonly modes: Array<BartenderBarMode>
  private isPushed = false

  constructor (options: BartenderPushElementOptions = {}) {
    // Get element
    this.el = resolveElement(options.el, options.elSelector)
    if (!this.el) throw new BartenderError('Element is required for push element')

    this.bars = options.bars || []
    this.modes = options.modes || ['push', 'reveal']
  }

  public push (bar: Bar, pushStyles: BartenderPushStyles): this {
    if (!this.el) return this
    if (this.bars.length && !this.bars.includes(bar)) return this
    if (this.modes.length && !this.modes.includes(bar.mode)) return this

    this.el.style.transform = pushStyles.transform
    this.el.style.transitionDuration = pushStyles.transitionDuration
    this.el.style.transitionTimingFunction = pushStyles.transitionTimingFunction

    this.isPushed = true

    return this
  }

  public pull (): this {
    if (!this.el || this.isPushed === false) return this

    this.el.style.transform = 'translateX(0) translateY(0)'

    return this
  }
}
