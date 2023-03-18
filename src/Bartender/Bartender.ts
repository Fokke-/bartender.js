import type { BartenderOptions, BartenderBars, BartenderBarOptions } from './Bartender.d'
import { BartenderBar } from './BartenderBar'

const defaultOptions = <BartenderOptions>{
  debug: false,
  mainEl: '.bartender',
  contentEl: '.bartender__content',
}

/**
 * Class for creating accessible off-canvas bars.
 */
export class Bartender {
  // TODO: overlay should be defined per bar
  // TODO: closeOnOverlayClick should be defined per bar
  // TODO: closeOnEsc should be defined per bar
  // TODO: trapFocus should be defined per bar
  // TODO: scrollTop should be defined per bar

  public debug = false
  readonly mainEl: string | Element | null = null
  readonly contentEl: string | Element | null = null
  readonly bars: BartenderBars = <BartenderBars>{}

  /**
   * Constructor
   *
   * @param options Bartender options
   * @throws Error message
   */
  constructor (options: BartenderOptions = <BartenderOptions>{}) {
    Object.assign(this, <BartenderOptions>{
      ...defaultOptions,
      ...options,
    })

    // Get main element
    this.mainEl = (() : Element => {
      if (this.mainEl instanceof HTMLElement) return this.mainEl

      if (typeof this.mainEl === 'string') {
        const mainEl = document.querySelector(this.mainEl)
        if (!mainEl) throw `Cannot find main element with selector: ${this.mainEl}`

        return mainEl
      }

      throw 'Main element is required'
    })()

    // Get content element
    this.contentEl = (() : Element => {
      if (this.contentEl instanceof HTMLElement) return this.contentEl

      if (typeof this.contentEl === 'string') {
        const contentEl = document.querySelector(this.contentEl)
        if (!contentEl) throw `Cannot find content element with selector: ${this.contentEl}`

        return contentEl
      }

      throw 'Content element is required'
    })()

    // Check that content element is a direct child of the main element
    if (this.contentEl.parentElement !== this.mainEl) throw 'Content element must be a direct child of the main element'
  }

  addBar (name: string, options: BartenderBarOptions = <BartenderBarOptions>{}) {
    if (!name || typeof name !== 'string') throw 'Name is required'
    if (this.bars[name]) throw `Bar with name '${name}' is already defined`

    const bar = new BartenderBar(name, options)
    bar.bartender = this
    bar.init()

    this.bars[name] = bar
  }
}
