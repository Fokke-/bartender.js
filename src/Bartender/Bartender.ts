import type {
  BartenderOptions,
  BartenderBars,
  BartenderBarOptions
} from './Bartender.d'
import { resolveElement, sleep } from './utils'
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
  readonly switchTimeout?: number
  private bars: BartenderBars = []
  public barOptions = {}

  /**
   * Constructor
   *
   * @param userOptions Bartender options
   * @param barOptions Default options for new bars
   * @throws Error message
   */
  constructor (
    userOptions: BartenderOptions = {},
    userBarOptions: BartenderBarOptions = {}
  ) {
    // Set options
    const defaultOptions: BartenderOptions = {
      debug: false,
      mainEl: undefined,
      mainElSelector: '.bartender',
      contentEl: undefined,
      contentElSelector: '.bartender__content',
      switchTimeout: 100,
    }

    Object.assign(this, {
      ...defaultOptions,
      ...userOptions,
    })

    // Set default options for new bars
    const defaultBarOptions: BartenderBarOptions = {
      position: 'left',
      mode: 'float',
      permanent: false,
    }

    this.barOptions = {
      ...defaultBarOptions,
      ...userBarOptions,
    }

    // Get required elements
    this.mainEl = resolveElement(this.mainEl, this.mainElSelector)
    if (!this.mainEl) throw 'Main element is required'

    this.contentEl = resolveElement(this.contentEl, this.contentElSelector)
    if (!this.contentEl) throw 'Content element is required'

    // Check that content element is a direct child of the main element
    if (this.contentEl.parentElement !== this.mainEl) throw 'Content element must be a direct child of the main element'

    // Add event listeners
    window.addEventListener('keydown', this.handleKeydown.bind(this))

    this.mainEl.classList.add('bartender--ready')
    this.mainEl.dispatchEvent(new CustomEvent('bartender-init', {
      bubbles: true,
      detail: {
        bartender: this,
      },
    }))
  }

  // TODO: make sure this is updated
  destroy () : void {
    this.mainEl?.classList.remove('bartender--ready')

    // TODO: Tear down event listeners
  }

  private getBar (name: string): BartenderBar | null {
    return this.bars.find(item => item.name === name) || null
  }

  /**
   * Get currently open bar
   *
   * @returns Bar object
   */
  private getOpenBar (): BartenderBar | null {
    return this.bars.find(item => item.isOpen === true) || null
  }

  /**
   * Add a new bar
   *
   * @param name Unique name for the bar
   * @param userOptions Bar options
   * @throws Error message
   * @returns this
   */
  addBar (name: string, userOptions: BartenderBarOptions = {}): Promise<BartenderBar | Error> {
    if (!name || typeof name !== 'string') return Promise.reject(new Error('Name is required'))
    if (this.getBar(name)) return Promise.reject(new Error(`Bar with name '${name}' is already defined`))

    const options: BartenderBarOptions = {
      ...this.barOptions,
      ...userOptions,
    }

    const bar = new BartenderBar(name, options)
    this.bars.push(bar)

    this.mainEl?.dispatchEvent(new CustomEvent('bartender-bar-added', {
      bubbles: true,
      detail: {
        bar,
      },
    }))

    return Promise.resolve(bar)
  }

  async open (name: string): Promise<BartenderBar | Error> {
    const bar = this.getBar(name)
    if (!bar) return Promise.reject(new Error(`Unknown bar '${name}'`))

    if (bar.isOpen === true) return Promise.reject(new Error(`Bar '${bar.name}' is already open`))
    if (this.busy === true) return Promise.reject(new Error('Bartender is busy'))

    this.busy = true

    // Close any open bar
    const openBar = this.getOpenBar()
    if (openBar) {
      await this.close()
      await sleep(this.switchTimeout)
    }

    await bar.open()
    this.busy = false

    return Promise.resolve(bar)
  }

  async close (): Promise<BartenderBar | null> {
    const bar = this.getOpenBar()
    if (!bar) return Promise.resolve(null)

    await bar.close()

    return Promise.resolve(bar)
  }

  async toggle (name: string): Promise<BartenderBar | Error | null> {
    const bar = this.getBar(name)
    if (!bar) return Promise.reject(new Error(`Unknown bar '${name}'`))

    return (bar.isOpen === true) ? this.close() : this.open(name)
  }

  handleKeydown (event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      const openBar = this.getOpenBar()
      if (!openBar || openBar.permanent === true) return

      openBar.close()
    }
  }
}
