'use strict';

class Bartender {

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
    // These elements will be moved when bar with "push" mode is being opened.
    this.pushElements = []

    // Run initializer
    this.init()
  }

  // Logging function
  log (text = '') {
    console.log('Bartender: ' + text)
  }

  // Error logging function
  logError (text = '') {
    console.error('Bartender: ' + text)
  }

  // Debug logging function
  debug (text = '') {
    if (!this.options.debug) return

    console.log('Bartender debug: ' + text)
  }

  // Initializer
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
          this.logError('Open button has invalid bar position \'' + position + '\' defined. Use one of the following values: left, right, top, bottom')
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
          this.logError('Toggle button has invalid bar position \'' + position + '\' defined. Use one of the following values: left, right, top, bottom')
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
        this.overlay.addEventListener('keydown', event => {
          if ([13, 32].indexOf(event.keyCode) >= 0) {
            event.preventDefault()
            this.close()
          }
        })

        this.contentWrap.appendChild(this.overlay)
      }

      // Enable closing the bar with escape key
      if (this.options.closeOnEsc) {
        window.addEventListener('keydown', event => {
          if (event.keyCode === 27) {
            event.preventDefault()
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

  isValidPosition (position = null) {
    return ['left', 'right', 'top', 'bottom'].indexOf(position) >= 0
  }

  addBar (bar) {
    try {
      // Get bar configuration
      let position = bar.getAttribute('data-bartender-bar')

      // Validate required elements
      if (!this.mainWrap || !this.contentWrap) return this

      // Validate position
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: left, right, top, bottom'

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

    return this
  }

  open (position = null, button = null) {
    try {
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: left, right, top, bottom'

      const bar = this.bars[position]

      if (!bar) throw 'Bar with position \'' + position + '\' is not defined. Use one of the following: ' + Object.keys(this.bars).join(', ') + '.'
      if (bar.element.classList.contains('bartender-bar--open')) return

      // Close other bars
      this.close()

      // Open bar
      this.debug('Opening bar \'' + position + '\'')
      bar.enableFocus()
      bar.element.classList.add('bartender-bar--open')

      // Wait until transition ends and dispatch event
      bar.element.addEventListener('transitionend', () => {
        this.debug('Opening bar \'' + this.currentOpenBar.position + '\' was finished')

        this.mainWrap.dispatchEvent(new CustomEvent('afterOpen', {
          detail: {
            bar: bar,
            button: button,
          }
        }))
      }, {
        once: true,
      })

      // Mark this bar as open
      this.currentOpenBar = bar

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
      this.mainWrap.dispatchEvent(new CustomEvent('open', {
        detail: {
          bar: bar,
          button: button,
        }
      }))
    } catch (error) {
      this.logError(error)
    }

    return this
  }

  toggle (position = null, button = null) {
    try {
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: left, right, top, bottom'

      if (this.currentOpenBar && this.currentOpenBar.position == position) {
        this.close()
      } else {
        this.close()
        this.open(position, button)
      }
    } catch (error) {
      this.logError(error)
    }

    return this
  }

  close () {
    try {
      if (!this.currentOpenBar) return

      // Dispatch event
      this.mainWrap.dispatchEvent(new CustomEvent('close', {
        detail: {
          bar: this.currentOpenBar,
        }
      }))

      // Close bar
      this.debug('Closing bar \'' + this.currentOpenBar.position + '\'')
      this.currentOpenBar.disableFocus()
      this.currentOpenBar.element.classList.remove('bartender-bar--open')

      // Focus open button which was used to open the bar
      if (this.previousOpenButton) {
        this.previousOpenButton.focus()
        this.previousOpenButton.setAttribute('aria-expanded', 'false')
        this.previousOpenButton = null
      } else {
        // Bar was closed using keyboard, or using API. Focus on content element instead.
        this.contentWrap.focus()
      }

      // Remove transforms from wrapper elements
      this.contentWrap.style.removeProperty('transform')
      this.mainWrap.style.removeProperty('overflow')

      // Remove transforms from pushable elements
      this.pushElements.forEach(el => {
        el.style.removeProperty('transform')
      })

      // Remove class from the main wrap
      this.mainWrap.classList.remove(this.options.openClass)

      // Hide overlay
      this.hideOverlay()

      // Wait until transition ends and dispatch event
      this.currentOpenBar.element.addEventListener('transitionend', () => {
        this.mainWrap.dispatchEvent(new CustomEvent('afterClose', {
          detail: {
            bar: this.bars[this.currentOpenBar.position],
          }
        }))

        this.debug('Closing bar \'' + this.currentOpenBar.position + '\' was finished')
        this.currentOpenBar = null
      }, {
        once: true,
      })
    } catch (error) {
      this.logError(error)
    }

    return this
  }

  setPush () {
    if (!this.currentOpenBar) return
    if (!this.currentOpenBar.mode) return

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

  showOverlay () {
    if (!this.overlay) return
    if (this.overlay.classList.contains('bartender-overlay--visible')) return

    this.debug('Showing overlay')

    this.overlay.classList.add('bartender-overlay--visible')
  }

  hideOverlay () {
    if (!this.overlay) return
    if (!this.overlay.classList.contains('bartender-overlay--visible')) return

    this.debug('Hiding overlay')

    this.overlay.classList.remove('bartender-overlay--visible')
  }
}

class BartenderBar {

  constructor() {
    this.element = null
    this.position = null
    this.mode = 'float'
    this.focusableElementSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  }

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
    if (['float', 'push', 'reveal'].indexOf(this.mode) < 0) throw 'Invalid mode \'' + this.mode + '\' for bar \'' + this.position + '\'. Use one of the following values: float, push, reveal.'

    // Disable focus
    this.disableFocus()

    return this
  }

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