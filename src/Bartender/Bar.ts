import type {
  BartenderBarOptions,
  BartenderBarPosition,
  BartenderBarMode,
  BartenderPushStyles
} from './Bartender.d'
import { resolveElement, sleep } from './utils'

export class BartenderBar {
  readonly name: string
  readonly el?: HTMLElement | null
  readonly elSelector?: string
  private position?: BartenderBarPosition
  private mode?: BartenderBarMode
  public isPushing = false
  public permanent = false
  public isOpen = false

  constructor (name: string, userOptions: BartenderBarOptions = {}) {
    if (!name) throw 'Bar name is required'

    // Assign options
    Object.assign(this, userOptions)

    this.name = name

    // Get element
    this.el = resolveElement(this.el, this.elSelector)
    if (!this.el) throw `Content element for bar '${this.name}' is required`

    // Check that element is a direct child of the main element
    // TODO: do this elsewhere
    //if (this.el.parentElement !== this.bartender.mainEl) throw `Element of bar '${this.name}' must be a direct child of the Bartender main element`

    // Temporarily disable transition
    this.el.style.transition = 'none'
    this.el.classList.add('bartender__bar')

    this.setPosition(this.position)
    this.setMode(this.mode)

    // Return transition
    setTimeout(() => {
      if (this.el) this.el.style.transition = ''
    })
  }

  private getTransitionDuration (): number {
    if (!this.el) return 0

    const duration = window.getComputedStyle(this.el).getPropertyValue('transition-duration') || '0s'
    return parseFloat(duration) * 1000
  }

  public setPosition (position?: BartenderBarPosition) : this {
    // Validate position
    if (!position) throw `Position is required for bar '${this.name}'`

    const validPositions = [
      'left',
      'right',
      'top',
      'bottom',
    ]

    if (!validPositions.includes(position)) throw `Invalid position '${position}' for bar '${this.name}'. Use one of the following: ${validPositions.join(', ')}.`

    // Remove old position class
    if (this.position) this.el?.classList.remove(`bartender__bar--${this.position}`)

    this.position = position
    this.el?.classList.add(`bartender__bar--${this.position}`)

    return this
  }

  public setMode (mode?: BartenderBarMode) : this {
    // Validate mode
    if (!mode) throw `Mode is required for bar '${this.name}'`

    const validModes = [
      'float',
      'push',
      'reveal',
    ]

    if (!validModes.includes(mode)) throw `Invalid mode '${mode}' for bar '${this.name}'. Use one of the following: ${validModes.join(', ')}.`

    this.isPushing = ['push', 'reveal'].includes(mode)

    // Remove old mode class
    if (this.mode) this.el?.classList.remove(`bartender__bar--${this.mode}`)

    this.mode = mode
    this.el?.classList.add(`bartender__bar--${this.mode}`)

    return this
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
    this.isOpen = true

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
    this.isOpen = false

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
