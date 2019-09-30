'use strict';

class OffCanvas {

  constructor (options) {
    // Apply user configuration
    this.options = Object.assign({
      debug: false, // Debug mode
      overlay: true, // Show shading overlay over content wrapper when bar is open?
      closeOnEsc: true, // Close open bar with escape key?
      mainWrapSelector: '.offcanvas-main',
      contentWrapSelector: '.offcanvas-content',
    }, options)

    this.overlay = null
    this.currentOpenBar = null
    this.previousOpenButton = null
    this.resizeTimeout = null
    this.bars = []
    // this.bars = {
    //   left: null,
    //   right: null,
    //   top: null,
    //   bottom: null,
    // }

    this.init()
  }

  // Logging function
  log (text = '') {
    console.log('Off-canvas: ' + text)
  }

  // Error logging function
  logError (text = '') {
    console.error('Off-canvas: ' + text)
  }

  // Debug logging function
  debug (text = '') {
    if (!this.options.debug) return

    console.log('Off-canvas debug: ' + text)
  }

  init () {
    try {
      // Find and validate required elements
      this.mainWrap = document.querySelector(this.options.mainWrapSelector)
      if (!this.mainWrap) throw 'Main wrap element was not found with selector: ' + this.options.mainWrapSelector

      this.contentWrap = this.mainWrap.querySelector(this.options.contentWrapSelector)
      if (!this.contentWrap) throw 'Content wrap element was not found with selector: ' + this.options.contentWrapSelector

      // Find bars
      this.mainWrap.querySelectorAll('[data-offcanvas-bar]').forEach(bar => {
        this.addBar(bar)
      })

      // Find buttons
      this.openButtons = this.mainWrap.querySelectorAll('[data-offcanvas-open]')
      this.closeButtons = this.mainWrap.querySelectorAll('[data-offcanvas-close]')
      this.toggleButtons = this.mainWrap.querySelectorAll('[data-offcanvas-toggle]')

      // Add classes
      this.mainWrap.classList.add('offcanvas-main')
      this.contentWrap.classList.add('offcanvas-content')

      // Add event listeners for open buttons
      this.openButtons.forEach(button => {
        let position = button.getAttribute('data-offcanvas-open')

        if (!this.isValidPosition(position)) {
          this.logError('Open button has invalid bar position \'' + position + '\' defined. Use one of the following values: left, right, top, bottom')
          return
        }

        button.addEventListener('click', () => this.open(position, button))
        button.addEventListener('keydown', event => {
          if ([13, 32].indexOf(event.keyCode) >= 0) {
            event.preventDefault()
            this.open(position, button)
          }
        })
      })

      // Add event listeners for toggle buttons
      this.toggleButtons.forEach(button => {
        let position = button.getAttribute('data-offcanvas-toggle')

        if (!this.isValidPosition(position)) {
          this.logError('Toggle button has invalid bar position \'' + position + '\' defined. Use one of the following values: left, right, top, bottom')
          return
        }

        button.addEventListener('click', () => this.toggle(position, button))
        button.addEventListener('keydown', event => {
          if ([13, 32].indexOf(event.keyCode) >= 0) {
            event.preventDefault()
            this.toggle(position, button)
          }
        })
      })

      // Add event listeners for close buttons
      this.closeButtons.forEach(button => {
        button.addEventListener('click', () => this.close())
        button.addEventListener('keydown', event => {
          if ([13, 32].indexOf(event.keyCode) >= 0) {
            event.preventDefault()
            this.close()
          }
        })
      })

      // Add overlay
      if (this.options.overlay && !this.overlay) {
        this.overlay = document.createElement('div')
        this.overlay.classList.add('offcanvas-overlay')
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
          this.setContentWrapPush()
        }, 200)
      })
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
      var position = bar.getAttribute('data-offcanvas-bar')
      var mode = bar.getAttribute('data-offcanvas-bar-mode')

      // Validate required elements
      if (!this.mainWrap || !this.contentWrap) return this

      // Validate position
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: left, right, top, bottom'

      // Check that bar is not already defined
      if (this.bars[position]) throw 'Duplicate bar with position \'' + position + '\''

      // Create new bar object
      const newBar = new OffCanvasBar()
      newBar.element = bar
      newBar.parentElement = this.mainWrap
      newBar.position = position
      if (mode) newBar.mode = mode
      newBar.init()

      // Insert new bar
      this.bars[position] = newBar

      this.debug('Added bar \'' + newBar.position + '\' with mode \'' + newBar.mode + '\'')
    } catch (error) {
      this.logError(error)
    }

    return this
  }

  open (position = null, button = null) {
    try {
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: left, right, top, bottom'

      const bar = this.bars[position]

      if (!bar) throw 'Bar with position \'' + position + '\' is not defined'
      if (bar.element.classList.contains('offcanvas-bar--open')) return

      // Close other bars
      this.close()

      // Open bar
      this.debug('Opening bar \'' + position + '\'')
      bar.open()

      // Mark this bar as open
      this.currentOpenBar = bar

      // Push content wrap if needed
      this.setContentWrapPush()

      // Remember the button which was used to open off-canvas
      this.previousOpenButton = button

      // Show overlay
      this.showOverlay()
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

      this.debug('Closing bar \'' + this.currentOpenBar.position + '\'')

      this.currentOpenBar.close()

      // Focus open button which was used to open the bar
      if (this.previousOpenButton) {
        this.previousOpenButton.focus()
        this.previousOpenButton = null
      }

      this.currentOpenBar = null
      this.contentWrap.style.removeProperty('transform')
      this.mainWrap.style.removeProperty('overflow')

      this.hideOverlay()
    } catch (error) {
      this.logError(error)
    }

    return this
  }

  setContentWrapPush () {
    if (!this.currentOpenBar) return
    if (!this.currentOpenBar.mode) return

    this.mainWrap.style.overflow = 'hidden'

    if (['push', 'slide'].indexOf(this.currentOpenBar.mode) >= 0) {
      switch (this.currentOpenBar.position) {
        case 'left':
          this.contentWrap.style.transform = 'translateX(' + this.currentOpenBar.element.offsetWidth + 'px)'
          break

        case 'right':
          this.contentWrap.style.transform = 'translateX(-' + this.currentOpenBar.element.offsetWidth + 'px)'
          break

        case 'top':
          this.contentWrap.style.transform = 'translateY(' + this.currentOpenBar.element.offsetHeight + 'px)'
          break

        case 'bottom':
          this.contentWrap.style.transform = 'translateY(-' + this.currentOpenBar.element.offsetHeight + 'px)'
          break
      }
    }
  }

  showOverlay () {
    if (!this.overlay) return
    if (this.overlay.classList.contains('offcanvas-overlay--visible')) return

    this.debug('Showing overlay')

    this.overlay.classList.add('offcanvas-overlay--visible')
  }

  hideOverlay () {
    if (!this.overlay) return
    if (!this.overlay.classList.contains('offcanvas-overlay--visible')) return

    this.debug('Hiding overlay')

    this.overlay.classList.remove('offcanvas-overlay--visible')
  }
}

class OffCanvasBar {

  constructor() {
    this.parentElement = null
    this.element = null
    this.position = null
    this.mode = 'float'
    this.focusableElementSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  }

  isValidMode(mode = '') {
    return ['float', 'push', 'slide'].indexOf(mode) >= 0
  }

  init () {
    // Validate required properties
    if (!this.position) throw 'Missing position for bar'
    if (!this.parentElement) throw 'Missing parent element for bar \'' + this.position + '\''

    // Check that defined bar element exists
    if (!this.element) throw 'Bar element for \'' + this.position + '\' was not found!'

    // Validate mode
    if (['float', 'push', 'slide'].indexOf(this.mode) < 0) throw 'Invalid mode \'' + this.mode + '\' for bar \'' + this.position + '\'. Use one of the following values: float, push, slide.'

    // Disable focus
    this.disableFocus()

    return this
  }

  disableFocus () {
    // Prevent focus on bar child elements
    this.element.querySelectorAll(this.focusableElementSelector).forEach(item => {
      item.setAttribute('tabindex', '-1')
    })

    // Prevent focus on bar
    this.element.setAttribute('tabindex', '-1')
    this.element.setAttribute('aria-hidden', 'true')

    return this
  }

  enableFocus () {
    // Enable focus on bar child elements
    this.element.querySelectorAll(this.focusableElementSelector).forEach(item => {
      item.removeAttribute('tabindex')
    })

    // Focus on bar
    this.element.removeAttribute('aria-hidden')
    this.element.setAttribute('tabindex', '0')
    this.element.focus()

    return this
  }

  open () {
    this.enableFocus()
    this.element.classList.add('offcanvas-bar--open')

    return this
  }

  close () {
    this.disableFocus()
    this.element.classList.remove('offcanvas-bar--open')

    return this
  }

}