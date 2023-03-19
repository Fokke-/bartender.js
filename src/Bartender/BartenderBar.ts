import type { BartenderBarOptions } from './Bartender.d'
import { Bartender } from './Bartender'
import { resolveElement } from './utils'

export class BartenderBar {
  readonly bartender?: Bartender
  readonly name?: string
  readonly el?: Element
  readonly elSelector?: string
  private position = ''

  constructor (name: string, options: BartenderBarOptions = <BartenderBarOptions>{}, bartender: Bartender) {
    if (!name) throw 'Bar name is required'
    if (!bartender) throw `You must pass Bartender instance for bar '${this.name}'`

    this.name = name

    Object.assign(this, <BartenderBarOptions>{
      ...<BartenderBarOptions>{
        position: 'left',
      },
      ...options,
    })

    this.bartender = bartender

    // Get element
    this.el = resolveElement(this.el, this.elSelector)
    if (!this.el) throw `Content element for bar '${this.name}' is required`

    // Check that element is a direct child of the main element
    if (this.el.parentElement !== this.bartender.mainEl) throw `Element of bar '${this.name}' must be a direct child of the Bartender main element`

    this.el.classList.add('bartender__bar')

    this.setPosition(this.position)
  }

  /**
   * Set bar position
   *
   * @param position
   * @throws Error message
   * @returns this
   */
  setPosition (position?: string) : this {
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
}
