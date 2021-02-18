'use strict';

/**
 * Class for creating accessible off-canvas bars.
 */
class Bartender {

  /**
   * @param {object} options - User defined options
   */
  constructor (options) {
    // Apply user configuration
    this.options = Object.assign({
      // Debug mode
      debug: false,

      // Show shading overlay over content wrapper when bar is open?
      overlay: true,

      // Close open bar with escape key?
      closeOnEsc: true,

      // Selector to find main wrapper
      mainWrapSelector: '.bartender-main',

      // Selector to find content wrapper
      contentWrapSelector: '.bartender-content',

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
    this.validBarPositions = ['left', 'right', 'top', 'bottom']

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
      this.mainWrap.querySelectorAll('[data-bartender-bar]').forEach(bar => {
        this.addBar(bar)
      })

      // Check that there's at least one bar defined
      if (!Object.keys(this.bars).length) throw 'Cannot find any bars.'

      // Open buttons
      this.openButtons.forEach(button => {
        let position = button.getAttribute('data-bartender-open')

        if (!this.isValidPosition(position)) {
          this.logError('Open button has invalid bar position \'' + position + '\' defined. Use one of the following values: ' + this.validBarPositions.join(', '))
          return
        }

        // Add ARIA attributes
        button.setAttribute('aria-expanded', 'false')

        // Event listeners for open buttons
        button.addEventListener('click', () => {
          this.open(position, button)
        })
      })

      // Toggle buttons
      this.toggleButtons.forEach(button => {
        let position = button.getAttribute('data-bartender-toggle')

        if (!this.isValidPosition(position)) {
          this.logError('Toggle button has invalid bar position \'' + position + '\' defined. Use one of the following values: ' + this.validBarPositions.join(', '))
          return
        }

        // Add ARIA attributes
        button.setAttribute('aria-expanded', 'false')

        // Event listeners for toggle buttons
        button.addEventListener('click', () => {
          this.toggle(position, button)
        })
      })

      // Close buttons
      this.closeButtons.forEach(button => {
        // Event listeners for close buttons
        button.addEventListener('click', () => {
          this.close()
        })
      })

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
          if (event.keyCode === 27) {
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
   * Is defined bar position valid?
   *
   * @param {string} position - Position to validate
   * @returns {boolean}
   */
  isValidPosition (position = null) {
    return this.validBarPositions.indexOf(position) >= 0
  }

  /**
   * Add a new off-canvas bar
   *
   * @param {object} - BartenderBar instance
   * @returns {object} Added bar instance
   */
  addBar (bar) {
    try {
      // Get bar configuration
      let position = bar.getAttribute('data-bartender-bar')

      // Validate required elements
      if (!this.mainWrap || !this.contentWrap) return this

      // Validate position
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: ' + this.validBarPositions.join(', ')

      // Check that bar is not already defined
      if (this.bars[position]) throw 'Bar with position \'' + position + '\' is already defined'

      // Create new bar object
      const newBar = new BartenderBar()
      newBar.element = bar
      newBar.init()

      // Insert new bar
      this.bars[position] = newBar

      this.debug('Added bar \'' + position + '\' with mode \'' + newBar.mode + '\'')
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
  async open (position = '', button = null) {
    try {
      // Validate position
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: ' + this.validBarPositions.join(', ')

      // Get bar instance
      const bar = this.bars[position]

      if (!bar) throw 'Bar with position \'' + position + '\' is not defined. Use one of the following: ' + Object.keys(this.bars).join(', ') + '.'

      // Close other bars
      await this.close()

      this.debug('Opening bar \'' + position + '\'')

      // Wait until transition ends and dispatch event
      bar.element.addEventListener('transitionend', () => {
        // User might close bar before the transition ends,
        // so make sure that this bar is still open.
        if (this.currentOpenBar === null || this.currentOpenBar.position !== bar.position) return

        this.debug('Opening bar \'' + bar.position + '\' was finished')

        this.mainWrap.dispatchEvent(new CustomEvent('bartender-afterOpen', {
          bubbles: true,
          detail: {
            bar: bar,
            button: button,
          }
        }))
      }, {
        once: true,
      })

      // Focus on bar
      bar.enableFocus()

      // Mark this bar as open
      this.currentOpenBar = bar
      bar.element.classList.add('bartender-bar--open')

      // Push elements
      this.setPush()

      // Add class to the main wrap
      this.mainWrap.classList.add(this.options.openClass)

      // Remember the button which was used to open off-canvas
      this.previousOpenButton = button

      // Set ARIA attributes of the button
      if (button) button.setAttribute('aria-expanded', true)

      // Show overlay
      this.showOverlay()

      // Dispatch event
      this.mainWrap.dispatchEvent(new CustomEvent('bartender-open', {
        bubbles: true,
        detail: {
          bar: bar,
          button: button,
        }
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
   * @returns {Promise} Resolve with closed bar or reject with an error
   */
  close () {
    return new Promise((resolve, reject) => {
      try {
        if (!this.currentOpenBar) return resolve()

        let bar = this.bars[this.currentOpenBar.position]

        this.debug('Closing bar \'' + bar.position + '\'')

        // Dispatch event
        this.mainWrap.dispatchEvent(new CustomEvent('bartender-close', {
          bubbles: true,
          detail: {
            bar: bar,
          }
        }))

        // Hide overlay
        this.hideOverlay()

        // Remove transform from wrapper element
        this.contentWrap.style.removeProperty('transform')

        // Remove transforms from pushable elements
        this.pushElements.forEach(el => {
          el.style.removeProperty('transform')
        })

        // Close bar
        bar.disableFocus()
        bar.element.classList.remove('bartender-bar--open')

        this.currentOpenBar = null

        // Wait until bar transition ends
        bar.element.addEventListener('transitionend', () => {
          // Dispatch event
          this.mainWrap.dispatchEvent(new CustomEvent('bartender-afterClose', {
            bubbles: true,
            detail: {
              bar: bar,
            }
          }))

          // Restore scrolling to the main wrap
          this.mainWrap.style.removeProperty('overflow')

          // Remove class from the main wrap
          this.mainWrap.classList.remove(this.options.openClass)

          // Focus open button which was used to open the bar
          if (this.previousOpenButton) {
            this.previousOpenButton.focus()
            this.previousOpenButton.setAttribute('aria-expanded', 'false')
            this.previousOpenButton = null
          } else {
            // Bar was closed using keyboard or API. Focus on content element instead.
            this.contentWrap.focus()
          }

          setTimeout(() => {
            this.debug('Closing bar \'' + bar.position + '\' was finished')

            return resolve(bar)
          }, 200)
        }, {
          once: true,
        })
      } catch (error) {
        this.logError(error)

        return reject(error)
      }
    })
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

    if (['push', 'reveal'].indexOf(this.currentOpenBar.mode) >= 0) {
      // Transform content wrapper
      this.contentWrap.style.transform = transform
    }

    // Transform other pushable elements
    this.pushElements.forEach(el => {
      el.style.transform = transform
    })
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

/**
 * Class representing a single Bartender bar
 */
class BartenderBar {

  constructor() {
    this.element = null
    this.position = null
    this.mode = 'float'
    this.focusableElementSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    this.validModes = ['float', 'push', 'reveal']
  }

  /**
   * Initialize bar
   *
   * @returns {object} Bar instance
   */
  init () {
    // Check that defined bar element exists
    if (!this.element) throw 'Bar element for \'' + this.position + '\' was not found!'

    // Set position
    this.position = this.element.getAttribute('data-bartender-bar')
    if (!this.position) throw 'Missing position for bar'

    // Set mode
    if (this.element.getAttribute('data-bartender-bar-mode')) {
      this.mode = this.element.getAttribute('data-bartender-bar-mode')
    }

    // Validate mode
    if (this.validModes.indexOf(this.mode) < 0) throw 'Invalid mode \'' + this.mode + '\' for bar \'' + this.position + '\'. Use one of the following values: ' + this.validModes.join(', ')

    // Disable focus
    this.disableFocus()

    return this
  }

  /**
   * Disable focus on bar child elements
   *
   * @returns {object} Bar instance
   */
  disableFocus () {
    // Disable focus on bar child elements
    this.element.querySelectorAll(this.focusableElementSelector).forEach(item => {
      item.setAttribute('tabindex', '-1')
    })

    // Disable focus on bar
    this.element.setAttribute('tabindex', '-1')
    this.element.setAttribute('aria-hidden', 'true')

    return this
  }

  /**
   * Enable focus on bar child elements
   *
   * @returns {object} Bar instance
   */
  enableFocus () {
    // Enable focus on bar child elements
    this.element.querySelectorAll(this.focusableElementSelector).forEach(item => {
      item.removeAttribute('tabindex')
    })

    // Enable focus on bar
    this.element.removeAttribute('aria-hidden')
    this.element.setAttribute('tabindex', '0')

    // Focus on bar
    this.element.focus()

    return this
  }

}