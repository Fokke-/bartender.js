import type {
  BartenderBarOptions,
  BartenderBarPosition,
  BartenderBarMode
} from './Bartender.d'
import { Bartender } from './Bartender'
import { resolveElement, sleep } from './utils'

export class BartenderBar {
  readonly bartender: Bartender
  readonly name?: string
  readonly el?: Element
  readonly elSelector?: string
  private position?: BartenderBarPosition
  private mode?: BartenderBarMode
  public permanent = false
  public isOpen = false
  public switchTimeout?: number

  constructor (name: string, options: BartenderBarOptions = <BartenderBarOptions>{}, bartender: Bartender) {
    if (!name) throw 'Bar name is required'
    if (!bartender) throw `You must pass Bartender instance for bar '${this.name}'`

    // Assign options
    Object.assign(this, options)

    this.name = name
    this.bartender = bartender

    // Get element
    this.el = resolveElement(this.el, this.elSelector)
    if (!this.el) throw `Content element for bar '${this.name}' is required`

    // Check that element is a direct child of the main element
    if (this.el.parentElement !== this.bartender.mainEl) throw `Element of bar '${this.name}' must be a direct child of the Bartender main element`

    this.el.classList.add('bartender__bar')

    this.setPosition(<BartenderBarPosition>this.position)
    this.setMode(<BartenderBarMode>this.mode)

    console.log(this)
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

    // Remove old mode class
    if (this.mode) this.el?.classList.remove(`bartender__bar--${this.mode}`)

    this.mode = mode
    this.el?.classList.add(`bartender__bar--${this.mode}`)

    return this
  }

  async open () : Promise<this> {
    // Bail out if this bar is already open
    const openBar = this.bartender?.getOpenBar()
    if (openBar?.name === this.name) return Promise.resolve(this)

    if (this.bartender?.busy === true) return Promise.resolve(this)
    this.bartender.busy = true

    // Close any open bar
    if (openBar) {
      await openBar.close()
      await sleep(this.switchTimeout)
    }

    // Resolve after transition is finished
    return new Promise(resolve => {
      this.el?.addEventListener('transitionend', () => {
        this.el?.dispatchEvent(new CustomEvent('bartender-bar-after-open', {
          bubbles: true,
          detail: {
            bar: this,
          },
        }))

        this.bartender.busy = false
        return resolve(this)
      }, {
        once: true,
      })

      this.el?.dispatchEvent(new CustomEvent('bartender-bar-before-open', {
        bubbles: true,
        detail: {
          bar: this,
        },
      }))

      this.el?.classList.add('bartender__bar--open')
      this.isOpen = true
    })
  }

  close () : Promise<this> {
    // Resolve after transition is finished
    return new Promise(resolve => {
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

      this.el?.dispatchEvent(new CustomEvent('bartender-bar-before-close', {
        bubbles: true,
        detail: {
          bar: this,
        },
      }))

      this.el?.classList.remove('bartender__bar--open')
      this.isOpen = false
    })
  }

  toggle () : Promise<this> {
    return (this.isOpen === true) ? this.close() : this.open()
  }
}
