import type {
  BartenderOptions,
  BartenderBarDefaultOptions,
  BartenderBarOptions,
  BartenderOpenOptions,
} from './types'
import { BartenderError } from './BartenderError'
import { BartenderBar } from './BartenderBar'

/**
 * Class for creating accessible off-canvas bars.
 */
export class Bartender {
  /** Enable debug mode? */
  private _debug: boolean = false

  /** Bars added to the instance */
  public readonly bars: BartenderBar[] = []

  /** Currently open bars */
  public readonly openBars: BartenderBar[] = []

  /** Default options for the bars */
  private readonly barDefaultOptions: BartenderBarOptions = {
    el: null,
    position: 'left',
    overlay: true,
    permanent: false,
    scrollTop: true,
  }

  /** Handler for keydown events */
  private onKeydownHandler

  /** Handler for bartender-bar-before-open events */
  private onBarBeforeOpenHandler

  /** Handler for bartender-bar-before-close events */
  private onBarBeforeCloseHandler

  /** Handler for bartender-bar-backdrop-click events */
  private onBarBackdropClickHandler

  /**
   * Create a new Bartender instance
   */
  constructor(
    options: BartenderOptions = {},
    barDefaultOptions: BartenderBarDefaultOptions = {},
  ) {
    this.debug = options.debug ?? this._debug
    this.barDefaultOptions = {
      ...this.barDefaultOptions,
      ...barDefaultOptions,
    }

    // Handler for keydown events
    this.onKeydownHandler = ((event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        const openBar = this.getOpenBar()
        if (openBar && openBar.permanent === true) {
          event.preventDefault()
          return
        }
      }
    }).bind(this)

    // Handler for bartender-bar-before-open events
    this.onBarBeforeOpenHandler = (event: CustomEvent): void => {
      this.openBars.push(event.detail.bar)

      if (this.openBars.some((bar) => bar.isModal === true)) {
        document.body.classList.add('bartender-disable-scroll')
      }

      document.body.classList.add('bartender-open')
    }

    // Handler for bartender-bar-before-close events
    this.onBarBeforeCloseHandler = (event: CustomEvent): void => {
      this.openBars.splice(this.openBars.indexOf(event.detail.bar), 1)

      if (!this.openBars.length) {
        document.body.classList.remove('bartender-open')
      }

      if (!this.openBars.some((bar) => bar.isModal === true)) {
        document.body.classList.remove('bartender-disable-scroll')
      }
    }

    // Handler for bartender-bar-backdrop-click events
    this.onBarBackdropClickHandler = (event: CustomEvent): void => {
      if (this.getOpenBar()?.name !== event.detail.bar.name) {
        return
      }

      this.close(event.detail.bar.name)
    }

    // Add event listeners
    document.addEventListener('keydown', this.onKeydownHandler as EventListener)
    document.addEventListener(
      'bartender-bar-before-open',
      this.onBarBeforeOpenHandler as EventListener,
    )
    document.addEventListener(
      'bartender-bar-before-close',
      this.onBarBeforeCloseHandler as EventListener,
    )
    document.addEventListener(
      'bartender-bar-backdrop-click',
      this.onBarBackdropClickHandler as EventListener,
    )

    document.body.classList.add('bartender-ready')
    window.dispatchEvent(
      new CustomEvent('bartender-init', {
        detail: { bartender: this },
      }),
    )

    if (this.debug) {
      console.debug('Bartender initialized', this)
    }
  }

  /** Enable debug mode? */
  public get debug() {
    return this._debug
  }

  public set debug(val: boolean) {
    this._debug = val

    for (const bar of this.bars) {
      bar.debug = val
    }
  }

  /**
   * Get bar instance by name
   */
  public getBar(name: string): BartenderBar | null {
    return this.bars.find((item) => item.name === name) || null
  }

  /**
   * Get the topmost open bar instance
   */
  private getOpenBar(): BartenderBar | null {
    if (!this.openBars.length) {
      return null
    }

    return this.openBars[this.openBars.length - 1]
  }

  /**
   * Add a new bar
   */
  public addBar(name: string, options: BartenderBarOptions = {}): BartenderBar {
    if (!name) {
      throw new BartenderError('Bar name is required')
    }

    if (this.getBar(name)) {
      throw new BartenderError(`Bar with name '${name}' is already defined`)
    }

    // Create a new bar
    const bar = new BartenderBar(name, {
      ...this.barDefaultOptions,
      ...options,
    })

    // Set debug mode
    bar.debug = this.debug

    // Check that element is not assigned to another bar
    if (this.bars.some((item) => item.el === bar.el)) {
      throw new BartenderError(
        `Element of bar '${bar.name}' is already being used for another bar`,
      )
    }

    // Add the bar
    this.bars.push(bar)
    window.dispatchEvent(
      new CustomEvent('bartender-bar-added', {
        detail: { bar },
      }),
    )

    if (this.debug) {
      console.debug('Added a new bar', bar)
    }

    return bar
  }

  /**
   * Remove bar instance by name
   */
  public removeBar(name: string): this {
    if (!name) {
      throw new BartenderError('Bar name is required')
    }

    const bar = this.getBar(name)
    if (!bar) {
      throw new BartenderError(`Bar with name '${name}' was not found`)
    }

    if (bar.isOpen() === true) {
      this.close(name)
    }

    bar.destroy()
    this.bars.splice(
      this.bars.findIndex((item) => item.name === name),
      1,
    )

    window.dispatchEvent(
      new CustomEvent('bartender-bar-removed', {
        detail: { name },
      }),
    )

    if (this.debug) {
      console.debug(`Removed bar '${name}'`)
    }

    return this
  }

  /**
   * Open bar
   */
  public async open(
    bar: BartenderBar | string,
    options: BartenderOpenOptions = {},
  ): Promise<BartenderBar> {
    const targetBar = (() => {
      if (bar instanceof BartenderBar) {
        return bar
      }

      if (typeof bar === 'string') {
        return this.getBar(bar)
      }

      return null
    })()

    if (!targetBar) {
      throw new BartenderError(`Unknown bar '${bar}'`)
    }

    if (targetBar.isOpen() === true) {
      return targetBar
    }

    options = {
      closeOtherBars: true,
      modal: true,
      ...options,
    }

    if (options.closeOtherBars === true) {
      this.closeAll()
    }

    await targetBar.open(options)
    return targetBar
  }

  /**
   * Close bar
   *
   * If bar is undefined, the topmost bar will be closed.
   */
  public async close(
    bar?: BartenderBar | string,
  ): Promise<BartenderBar | null> {
    const targetBar = (() => {
      if (!bar) {
        return this.getOpenBar()
      }

      if (bar instanceof BartenderBar) {
        return bar
      }

      if (typeof bar === 'string') {
        return this.getBar(bar)
      }

      return null
    })()

    if (!targetBar || !targetBar.isOpen()) {
      return null
    }

    await targetBar.close()
    return targetBar
  }

  /**
   * Close all bars
   */
  public async closeAll(closeNonModalBars: boolean = false): Promise<this> {
    const barNames = this.openBars.reduce((acc, item) => {
      if (closeNonModalBars === false && item.isModal === false) {
        return acc
      }

      acc.push(item.name)
      return acc
    }, [] as string[])

    await Promise.all(
      barNames.map((name) => {
        return this.close(name)
      }),
    )

    return this
  }

  /**
   * Toggle bar open/closed state.
   */
  public async toggle(
    bar?: BartenderBar | string,
    options: BartenderOpenOptions = {},
  ): Promise<BartenderBar | null> {
    const targetBar = (() => {
      if (bar instanceof BartenderBar) {
        return bar
      }

      if (typeof bar === 'string') {
        return this.getBar(bar)
      }

      return null
    })()

    if (!targetBar) {
      throw new BartenderError(`Unknown bar '${bar}'`)
    }

    return targetBar.isOpen() === true
      ? await this.close(targetBar)
      : await this.open(targetBar, options)
  }

  /**
   * Destroy Bartender instance
   */
  public destroy(): this {
    this.closeAll()

    // Get all bar names
    const barNames = this.bars.flatMap((item) => item.name)
    for (const name of barNames) {
      if (!this.getBar(name)) {
        continue
      }

      this.removeBar(name)
    }

    // Remove classes
    document.body.classList.remove('bartender', 'bartender-ready')

    // Remove event listeners
    document.removeEventListener(
      'keydown',
      this.onKeydownHandler as EventListener,
    )
    document.removeEventListener(
      'bartender-bar-before-open',
      this.onBarBeforeOpenHandler as EventListener,
    )
    document.removeEventListener(
      'bartender-bar-before-close',
      this.onBarBeforeCloseHandler as EventListener,
    )
    document.removeEventListener(
      'bartender-bar-backdrop-click',
      this.onBarBackdropClickHandler as EventListener,
    )

    window.dispatchEvent(
      new CustomEvent('bartender-destroyed', {
        detail: { bartender: this },
      }),
    )

    if (this.debug) {
      console.debug('Bartender destroyed', this)
    }

    return this
  }
}
