import type {
  BartenderOptions,
  BartenderBars,
  BartenderBarOptions
} from './Bartender.d'
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
  public busy = false
  readonly mainEl?: HTMLElement | HTMLBodyElement | null
  readonly mainElSelector?: string
  readonly contentEl?: HTMLElement | null
  readonly contentElSelector?: string
  readonly bars: BartenderBars = <BartenderBars>{}
  public barDefaultOptions = <BartenderBarOptions>{}

  /**
   * Constructor
   *
   * @param options Bartender options
   * @param barDefaultOptions Default options for new bars
   * @throws Error message
   */
  constructor (options: BartenderOptions = <BartenderOptions>{}, barDefaultOptions: BartenderBarOptions = <BartenderBarOptions>{}) {
    // Assign options
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

    // Assing default options for bars
    Object.assign(this.barDefaultOptions, <BartenderBarOptions>{
      ...<BartenderBarOptions>{
        position: 'left',
        mode: 'float',
        permanent: false,
        switchTimeout: 100,
      },
      ...barDefaultOptions,
    })

    // Get required elements
    this.mainEl = resolveElement(this.mainEl, this.mainElSelector)
    if (!this.mainEl) throw 'Main element is required'

    this.contentEl = resolveElement(this.contentEl, this.contentElSelector)
    if (!this.contentEl) throw 'Content element is required'

    // Check that content element is a direct child of the main element
    if (this.contentEl.parentElement !== this.mainEl) throw 'Content element must be a direct child of the main element'

    // Start listening keys
    // TODO: add destroy method
    window.addEventListener('keydown', this.handleKeydown.bind(this))

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
   * @returns this
   */
  addBar (name: string, options: BartenderBarOptions = <BartenderBarOptions>{}): this {
    if (!name || typeof name !== 'string') throw 'Name is required'
    if (this.bars[name]) throw `Bar with name '${name}' is already defined`

    options = Object.assign(<BartenderBarOptions>{}, <BartenderBarOptions>{
      ...this.barDefaultOptions,
      ...options,
    })

    this.bars[name] = new BartenderBar(name, options, this)

    this.mainEl?.dispatchEvent(new CustomEvent('bartender-bar-added', {
      bubbles: true,
      detail: {
        bar: this.bars[name],
      },
    }))

    return this
  }

  getBar (name: string): BartenderBar | null {
    if (!this.bars[name] || !(this.bars[name] instanceof BartenderBar)) return null

    return this.bars[name]
  }

  /**
   * Get currently open bar
   *
   * @returns Bar object
   */
  getOpenBar (): BartenderBar | null {
    const name = Object.keys(this.bars).find(key => {
      return this.bars[key].isOpen === true
    })

    return (name) ? this.bars[name] : null
  }

  handleKeydown (event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      const openBar = this.getOpenBar()
      if (!openBar || openBar.permanent === true) return

      openBar.close()
    }
  }
}
