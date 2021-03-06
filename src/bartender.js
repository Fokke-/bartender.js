'use strict'

/**
 * Class for creating accessible off-canvas bars.
 */
class Bartender {

  /**
   * @param {object} options - User defined options
   */
  constructor (options) {
    // Polyfill custom events
    if (typeof window.CustomEvent !== 'function') {
      window.CustomEvent = function (event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: null,
        }

        var evt = document.createEvent('CustomEvent')
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
        return evt
      }
    }

    // Apply user configuration
    this.options = Object.assign({
      // Debug mode
      debug: false,

      // Show shading overlay over content wrapper when bar is open?
      overlay: true,

      // Close open bar with escape key?
      closeOnEsc: true,

      // Trap focus to the open bar?
      trapFocus: false,

      // Selector to find main wrapper
      mainWrapSelector: '.bartender-main',

      // Selector to find content wrapper
      contentWrapSelector: '.bartender-content',

      // Selector for focusable elements
      focusableElementSelector: '[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',

      // Classes
      readyClass: 'bartender-ready',
      openClass: 'bartender-open',
    }, options)

    // Overlay element
    this.overlay = null

    // Currently open bar
    this.currentOpenBar = null

    // Button which was previously used to open the bar
    this.previousOpenButton = null

    // Window resize timeout
    this.resizeTimeout = null

    // Object for storing the bars
    this.bars = {}

    // Arrays for storing buttons
    this.openButtons = []
    this.closeButtons = []
    this.toggleButtons = []

    // Array for storing pushable elements
    // These elements will be moved when bar with "push" or "reveal" mode is being opened.
    this.pushElements = []

    // Valid bar positions
    this.validBarPositions = [
      'left',
      'right',
      'top',
      'bottom',
    ]

    // Valid bar modes
    this.validModes = [
      'float',
      'push',
      'reveal',
    ]

    // Run initializer
    this.init()
  }

  /**
   * Log to console
   *
   * @param {string} text - Text to log
   * @returns {void}
   */
  log (text = '') {
    console.log('Bartender: ' + text)
  }

  /**
   * Log error to console
   *
   * @param {string} text - Text to log
   * @returns {void}
   */
  logError (text = '') {
    console.error('Bartender: ' + text)
  }

  /**
   * Log debug message to console
   *
   * @param {string} text - Text to log
   * @returns {void}
   */
  debug (text = '') {
    if (!this.options.debug) return

    console.log('Bartender debug: ' + text)
  }

  /**
   * Disable focus on element and it's children
   *
   * @param {object} DOM element
   * @returns {object} DOM element
   */
  disableFocus (element) {
    const startTime = performance.now()

    // Disable focus of element children
    const children = element.querySelectorAll(this.options.focusableElementSelector)

    for (let i = 0; i < children.length; i++) {
      children[i].setAttribute('data-bartender-prevtabindex', children[i].getAttribute('tabindex'))
      children[i].setAttribute('tabindex', '-1')
    }

    // Disable focus of the element
    element.setAttribute('tabindex', '-1')
    element.setAttribute('aria-hidden', 'true')

    const endTime = performance.now()
    this.debug('Disabled focus of ' + children.length + ' elements in ' + (endTime - startTime))

    return element
  }

  /**
   * Enable focus on element and it's children
   *
   * @param {object} DOM element
   * @returns {object} DOM element
   */
  enableFocus (element) {
    const startTime = performance.now()

    // Enable focus of element children
    const children = element.querySelectorAll('[data-bartender-prevtabindex]')

    for (let i = 0; i < children.length; i++) {
      // If element has previous tabindex marked, return it. Otherwise just remove tabindex attribute.
      if (children[i].getAttribute('data-bartender-prevtabindex') != 'null') {
        children[i].setAttribute('tabindex', children[i].getAttribute('data-bartender-prevtabindex'))
      } else {
        children[i].removeAttribute('tabindex')
      }

      children[i].removeAttribute('data-bartender-prevtabindex')
    }

    // Enable focus of the element
    element.setAttribute('tabindex', '0')
    element.removeAttribute('aria-hidden')

    const endTime = performance.now()
    this.debug('Enabled focus of ' + children.length + ' elements in ' + (endTime - startTime))

    return element
  }

  /**
   * Is defined bar position valid?
   *
   * @param {string} position - Position to validate
   * @returns {boolean}
   */
  isValidPosition (position = null) {
    return this.validBarPositions.indexOf(position) >= 0
  }

  /**
   * Initialize Bartender
   *
   * @returns {object} Bartender instance
   */
  init () {
    try {
      // Find and validate required elements
      this.mainWrap = document.querySelector(this.options.mainWrapSelector)
      if (!this.mainWrap) throw 'Main wrap element was not found with selector: ' + this.options.mainWrapSelector

      this.contentWrap = this.mainWrap.querySelector(this.options.contentWrapSelector)
      if (!this.contentWrap) throw 'Content wrap element was not found with selector: ' + this.options.contentWrapSelector

      // Find buttons
      this.openButtons = this.mainWrap.querySelectorAll('[data-bartender-open]')
      this.closeButtons = this.mainWrap.querySelectorAll('[data-bartender-close]')
      this.toggleButtons = this.mainWrap.querySelectorAll('[data-bartender-toggle]')

      // Add classes
      this.mainWrap.classList.add('bartender-main')
      this.contentWrap.classList.add('bartender-content')

      // Find bars
      const bars = this.mainWrap.querySelectorAll('[data-bartender-bar]')

      for (let i = 0; i < bars.length; i++) {
        this.addBar(bars[i])
      }

      // Open buttons
      for (let i = 0; i < this.openButtons.length; i++) {
        let button = this.openButtons[i]
        let position = button.getAttribute('data-bartender-open')

        if (!this.isValidPosition(position)) {
          this.logError('Open button has invalid bar position \'' + position + '\' defined. Use one of the following values: ' + this.validBarPositions.join(', '))
          return
        }

        button.setAttribute('aria-expanded', 'false')
        button.addEventListener('click', () => {
          this.open(position, button)
        })
      }

      // Toggle buttons
      for (let i = 0; i < this.toggleButtons.length; i++) {
        let button = this.toggleButtons[i]
        let position = button.getAttribute('data-bartender-toggle')

        if (!this.isValidPosition(position)) {
          this.logError('Toggle button has invalid bar position \'' + position + '\' defined. Use one of the following values: ' + this.validBarPositions.join(', '))
          return
        }

        button.setAttribute('aria-expanded', 'false')
        button.addEventListener('click', () => {
          this.toggle(position, button)
        })
      }

      // Close buttons
      for (let i = 0; i < this.closeButtons.length; i++) {
        let button = this.closeButtons[i]

        button.addEventListener('click', () => {
          this.close()
        })
      }

      // Find pushable elements
      this.pushElements = this.mainWrap.querySelectorAll('[data-bartender-push]')

      if (this.pushElements.length) this.debug('Registered ' + this.pushElements.length + ' pushable elements.')

      // Add overlay
      if (this.options.overlay && !this.overlay) {
        this.overlay = document.createElement('div')
        this.overlay.classList.add('bartender-overlay')
        this.overlay.addEventListener('click', () => this.close())

        this.contentWrap.appendChild(this.overlay)
      }

      // Enable closing the bar with escape key
      if (this.options.closeOnEsc) {
        window.addEventListener('keydown', event => {
          let key = event.key || event.keyCode

          if (key === 'Escape' || key === 'Esc' || key === 27) {
            this.close()
          }
        })
      }

      // Adjust content wrapper transform when window is resized
      window.addEventListener('resize', () => {
        clearTimeout(this.resizeTimeout)

        this.resizeTimeout = setTimeout(() => {
          this.setPush()
        }, 200)
      })

      // Add class
      this.mainWrap.classList.add(this.options.readyClass)
    } catch (error) {
      this.logError(error)
    }

    return this
  }

  /**
   * Add a new off-canvas bar
   *
   * @param {object} bar - BartenderBar instance
   * @returns {object} Added bar instance
   */
  addBar (bar) {
    try {
      // Get bar configuration
      let position = bar.getAttribute('data-bartender-bar')
      let mode = bar.getAttribute('data-bartender-bar-mode')

      // If mode is not specified, fall back to 'float'
      if (!mode) {
        mode = 'float'
        bar.setAttribute('data-bartender-bar-mode', mode)
      }

      // Validate configuration
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: ' + this.validBarPositions.join(', ')
      if (this.validModes.indexOf(mode) < 0) throw 'Invalid mode \'' + mode + '\' for bar \'' + position + '\'. Use one of the following values: ' + this.validModes.join(', ')

      // Check that bar is not already defined
      if (this.bars[position]) throw 'Bar with position \'' + position + '\' is already defined'

      // Create new bar object
      const newBar = {
        element: bar,
        position: position,
        mode: mode,
      }

      this.bars[position] = newBar

      // Initially disable focus of the bar
      this.disableFocus(newBar.element)

      this.debug('Added bar \'' + position + '\' with mode \'' + mode + '\'')
    } catch (error) {
      this.logError(error)
    }

    return bar
  }

  /**
   * Open off-canvas bar
   *
   * @param {string} position - Bar position
   * @param {object} button - Button which was used to run this method
   * @returns {object} Opened bar instance
   */
  open (position = '', button = null) {
    try {
      // Validate position
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: ' + this.validBarPositions.join(', ')

      // Get bar instance
      const bar = this.bars[position]

      if (!bar) throw 'Bar with position \'' + position + '\' is not defined.'

      // Close other bars
      if (this.currentOpenBar) {
        this.close(false)
      } else if (this.options.trapFocus === true) {
        this.disableFocus(this.contentWrap)
      }

      this.debug('Opening bar \'' + position + '\'')

      // Mark this bar as open
      this.currentOpenBar = bar
      bar.element.classList.add('bartender-bar--open')

      // Focus on bar
      this.enableFocus(bar.element)
      bar.element.focus()

      // Push elements
      this.setPush()

      // Remember the button which was used to open the bar
      this.previousOpenButton = button

      // Set ARIA attributes of the button
      if (button) button.setAttribute('aria-expanded', true)

      // Show overlay
      this.showOverlay()

      // Add class to the main element
      this.mainWrap.classList.add(this.options.openClass)

      // Dispatch event
      this.mainWrap.dispatchEvent(new CustomEvent('bartender-open', {
        bubbles: true,
        detail: {
          bar: bar,
          button: button,
        },
      }))

      return bar
    } catch (error) {
      this.logError(error)
    }
  }

  /**
   * Toggle off-canvas bar
   *
   * @param {string} position - Bar position
   * @param {object} button - Button which was used to run this method
   * @returns {object} Toggled bar instance
   */
  async toggle (position = null, button = null) {
    try {
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: ' + this.validBarPositions.join(', ')

      if (this.currentOpenBar && this.currentOpenBar.position == position) {
        return this.close()
      } else {
        await this.close()
        return this.open(position, button)
      }
    } catch (error) {
      this.logError(error)
    }
  }

  /**
   * Close any open off-canvas bar
   *
   * @param {boolean} enableFocusOfContentWrap - Enable focus of content wrap
   * @returns {object} Closed bar
   */
  close (enableFocusOfContentWrap = true) {
    try {
      if (!this.currentOpenBar) return

      let bar = this.bars[this.currentOpenBar.position]

      this.debug('Closing bar \'' + bar.position + '\'')

      // Dispatch event
      this.mainWrap.dispatchEvent(new CustomEvent('bartender-close', {
        bubbles: true,
        detail: {
          bar: bar,
        },
      }))

      // Hide overlay
      this.hideOverlay()

      // Remove transform from wrapper element
      this.contentWrap.style.removeProperty('transform')

      // Remove transforms from pushable elements
      for (let i = 0; i < this.pushElements.length; i++) {
        this.pushElements[i].style.removeProperty('transform')
      }

      // Disable focus on bar element
      this.disableFocus(bar.element)

      // Enable focus on content element
      if (this.options.trapFocus === true && enableFocusOfContentWrap === true) this.enableFocus(this.contentWrap)

      // Close the bar
      bar.element.classList.remove('bartender-bar--open')
      this.currentOpenBar = null

      // Restore scrolling to the main wrap
      this.mainWrap.style.removeProperty('overflow')

      // Remove class from the main wrap
      this.mainWrap.classList.remove(this.options.openClass)

      // Focus open button which was used to open the bar
      if (this.previousOpenButton && this.previousOpenButton.getAttribute('tabindex') >= 0) {
        this.previousOpenButton.focus()
        this.previousOpenButton.setAttribute('aria-expanded', 'false')
        this.previousOpenButton = null
      } else if (enableFocusOfContentWrap === true) {
        // Bar was closed using keyboard or API. Focus on content wrapper instead.
        this.contentWrap.focus()
      }

      return bar
    } catch (error) {
      this.logError(error)
    }
  }

  /**
   * Set transforms for pushable elements
   *
   * @returns {void}
   */
  setPush () {
    if (!this.currentOpenBar || !this.currentOpenBar.mode) return

    let transform = null

    // Hide overflow of main wrapper
    // This has to be done first in order to get correct width/height
    this.mainWrap.style.overflow = 'hidden'

    switch (this.currentOpenBar.position) {
      case 'left':
        transform = 'translateX(' + this.currentOpenBar.element.offsetWidth + 'px)'
        break

      case 'right':
        transform = 'translateX(-' + this.currentOpenBar.element.offsetWidth + 'px)'
        break

      case 'top':
        transform = 'translateY(' + this.currentOpenBar.element.offsetHeight + 'px)'
        break

      case 'bottom':
        transform = 'translateY(-' + this.currentOpenBar.element.offsetHeight + 'px)'
        break
    }

    if ([
      'push',
      'reveal',
    ].indexOf(this.currentOpenBar.mode) >= 0) {
      // Transform content wrapper
      this.contentWrap.style.transform = transform
    }

    // Transform other pushable elements
    for (let i = 0; i < this.pushElements.length; i++) {
      this.pushElements[i].style.transform = transform
    }
  }

  /**
   * Show shading overlay
   *
   * @returns {void}
   */
  showOverlay () {
    if (!this.overlay) return
    if (this.overlay.classList.contains('bartender-overlay--visible')) return

    this.overlay.classList.add('bartender-overlay--visible')
  }

  /**
   * Hide shading overlay
   *
   * @returns {void}
   */
  hideOverlay () {
    if (!this.overlay) return
    if (!this.overlay.classList.contains('bartender-overlay--visible')) return

    this.overlay.classList.remove('bartender-overlay--visible')
  }
}
