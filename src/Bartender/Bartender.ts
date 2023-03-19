import type { BartenderOptions, BartenderBars, BartenderBarOptions } from './Bartender.d'
import { resolveElement } from './utils'
import { BartenderBar } from './BartenderBar'

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
  readonly mainEl?: Element
  readonly mainElSelector?: string
  readonly contentEl?: Element
  readonly contentElSelector?: string
  readonly bars: BartenderBars = <BartenderBars>{}

  /**
   * Constructor
   *
   * @param options Bartender options
   * @throws Error message
   */
  constructor (options: BartenderOptions = <BartenderOptions>{}) {
    Object.assign(this, <BartenderOptions>{
      ...<BartenderOptions>{
        debug: false,
        mainEl: undefined,
        mainElSelector: '.bartender',
        contentEl: undefined,
        contentElSelector: '.bartender__content',
      },
      ...options,
    })

    // Get required elements
    this.mainEl = resolveElement(this.mainEl, this.mainElSelector)
    if (!this.mainEl) throw 'Main element is required'

    this.contentEl = resolveElement(this.contentEl, this.contentElSelector)
    if (!this.contentEl) throw 'Content element is required'

    // Check that content element is a direct child of the main element
    if (this.contentEl.parentElement !== this.mainEl) throw 'Content element must be a direct child of the main element'

    this.mainEl.classList.add('bartender--ready')
    this.mainEl.dispatchEvent(new CustomEvent('bartender-init', {
      bubbles: true,
      detail: {
        bartender: this,
      },
    }))
  }

  /**
   * Add a new bar
   *
   * @param name Unique name for the bar
   * @param options Bar options
   * @throws Error message
   * @returns Added bar element
   */
  addBar (name: string, options: BartenderBarOptions = <BartenderBarOptions>{}): BartenderBar {
    if (!name || typeof name !== 'string') throw 'Name is required'
    if (this.bars[name]) throw `Bar with name '${name}' is already defined`

    this.bars[name] = new BartenderBar(name, options, this)

    this.mainEl?.dispatchEvent(new CustomEvent('bartender-bar-added', {
      bubbles: true,
      detail: {
        bartender: this,
        bar: this.bars[name],
      },
    }))

    return this.bars[name]
  }
}
