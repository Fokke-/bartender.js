import type { BartenderBarOptions } from './Bartender.d'
import { Bartender } from './Bartender'

const defaultOptions = <BartenderBarOptions>{
  position: 'left',
}

const validPositions = [
  'left',
  'right',
  'top',
  'bottom',
]

export class BartenderBar {
  public bartender?: Bartender
  readonly name?: string | null = null
  readonly position?: string | null = null
  private el: string | Element | null = null

  constructor (name: string, options: BartenderBarOptions = <BartenderBarOptions>{}) {
    if (!name) throw 'Bar name is required'
    this.name = name

    Object.assign(this, <BartenderBarOptions>{
      ...defaultOptions,
      ...options,
    })
  }

  public init () : this {
    if (!this.position || !validPositions.includes(this.position)) throw `Bar '${this.name}' position must be one of the following: ${validPositions.join(', ')}`

    // Get element
    this.el = (() : Element => {
      if (this.el instanceof HTMLElement) return this.el

      if (typeof this.el === 'string') {
        const contentEl = document.querySelector(this.el)
        if (!contentEl) throw `Cannot find element for bar '${this.name}' with selector: ${this.el}`

        return contentEl
      }

      throw `Content element for bar '${this.name}' is required`
    })()

    // Check that element is a direct child of the main element
    if (!this.bartender) throw `You must pass Bartender instance for bar '${this.name}' before initializing it`
    if (this.el.parentElement !== this.bartender.mainEl) throw `Element of bar '${this.name}' must be a direct child of the Bartender main element`

    return this
  }
}
