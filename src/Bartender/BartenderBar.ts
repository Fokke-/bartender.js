import type {
  BartenderBarOptions,
  BartenderBarPosition,
  BartenderBarMode
} from './Bartender.d'
import { resolveElement } from './utils'

export class BartenderBar {
  readonly name?: string
  readonly el?: HTMLElement | null
  readonly elSelector?: string
  private position?: BartenderBarPosition
  private mode?: BartenderBarMode
  private isPushing = false
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

  private hasTransition () : boolean {
    if (!this.el) return false

    return window.getComputedStyle(this.el).getPropertyValue('transition-duration') != '0s'
  }

  /**
   * Set position
   *
   * @param position
   * @throws Error message
   * @returns this
   */
  setPosition (position?: BartenderBarPosition) : this {
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

  /**
   * Set mode
   *
   * @param mode
   * @throws Error message
   * @returns this
   */
  setMode (mode?: BartenderBarMode) : this {
    // Validate mode
    if (!mode) throw `Mode is required for bar '${this.name}'`

    const validModes = [
      'float',
      'push',
      'reveal',
    ]

    if (!validModes.includes(mode)) throw `Invalid mode '${mode}' for bar '${this.name}'. Use one of the following: ${validModes.join(', ')}.`

    this.isPushing = ['push', 'reveal'].includes(mode)
    console.log(this.isPushing)

    // Remove old mode class
    if (this.mode) this.el?.classList.remove(`bartender__bar--${this.mode}`)

    this.mode = mode
    this.el?.classList.add(`bartender__bar--${this.mode}`)

    return this
  }

  async open () : Promise<this> {
    this.el?.dispatchEvent(new CustomEvent('bartender-bar-before-open', {
      bubbles: true,
      detail: {
        bar: this,
      },
    }))

    return new Promise(resolve => {
      // Resolve after transition has finished
      this.el?.addEventListener('transitionend', () => {
        this.el?.dispatchEvent(new CustomEvent('bartender-bar-after-open', {
          bubbles: true,
          detail: {
            bar: this,
          },
        }))

        return resolve(this)
      }, {
        once: true,
      })

      this.el?.classList.add('bartender__bar--open')
      this.isOpen = true

      // If transition is disabled, dispatch event manually
      if (this.hasTransition() === false) this.el?.dispatchEvent(new Event('transitionend'))
    })
  }

  close () : Promise<this> {
    this.el?.dispatchEvent(new CustomEvent('bartender-bar-before-close', {
      bubbles: true,
      detail: {
        bar: this,
      },
    }))

    return new Promise(resolve => {
      // Resolve after transition has finished
      this.el?.addEventListener('transitionend', () => {
        this.el?.dispatchEvent(new CustomEvent('bartender-bar-after-close', {
          bubbles: true,
          detail: {
            bar: this,
          },
        }))

        return resolve(this)
      }, {
        once: true,
      })

      this.el?.classList.remove('bartender__bar--open')
      this.isOpen = false

      // If transition is disabled, dispatch event manually
      if (this.hasTransition() === false) this.el?.dispatchEvent(new Event('transitionend'))
    })
  }
}
