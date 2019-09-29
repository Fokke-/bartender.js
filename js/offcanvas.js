'use strict';

class OffCanvas {

  constructor (options) {
    this.options = Object.assign({
      debug: false,
      overlay: true,
      mainWrapSelector: '.offcanvas-main',
      contentWrapSelector: '.offcanvas-content',
      openButtonSelector: '.offcanvas-open',
      closeButtonSelector: '.offcanvas-close',
      toggleButtonSelector: '.offcanvas-toggle',
    }, options)

    this.overlay = null
    this.mainWrap = document.querySelector(this.options.mainWrapSelector)
    this.contentWrap = document.querySelector(this.options.contentWrapSelector)
    this.openButtons = document.querySelectorAll(this.options.openButtonSelector)
    this.closeButtons = document.querySelectorAll(this.options.closeButtonSelector)
    this.toggleButtons = document.querySelectorAll(this.options.toggleButtonSelector)
    this.bars = {
      left: null,
      right: null,
      top: null,
      bottom: null,
    }

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
      // Validate required elements
      if (!this.mainWrap) throw 'Main wrap element was not found with selector: ' + this.options.mainWrapSelector
      if (!this.contentWrap) throw 'Content wrap element was not found with selector: ' + this.options.contentWrapSelector

      // Add classes
      this.mainWrap.classList.add('offcanvas-main')
      this.contentWrap.classList.add('offcanvas-content')

      // Add event listeners for open buttons
      this.openButtons.forEach(button => {
        let position = button.getAttribute('data-offcanvas-bar') || 'left'

        if (!this.isValidPosition(position)) {
          this.logError('Open button has invalid bar position \'' + position + '\' defined. Use one of the following values: left, right, top, bottom')
          return
        }

        button.addEventListener('click', () => this.open(position))
        button.addEventListener('keydown', event => {
          if ([13, 32].indexOf(event.keyCode) > -1) {
            event.preventDefault()
            this.open(position)
          }
        })
      })

      // Add event listeners for close buttons
      this.closeButtons.forEach(button => {
        button.addEventListener('click', () => this.close())
        button.addEventListener('keydown', event => {
          if ([13, 32].indexOf(event.keyCode) > -1) {
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
          if ([13, 32].indexOf(event.keyCode) > -1) {
            event.preventDefault()
            this.close()
          }
        })

        this.contentWrap.appendChild(this.overlay)
      }

      console.log(this)
    } catch (error) {
      this.logError(error)
    }
  }

  isValidPosition (position = null) {
    return ['left', 'right', 'top', 'bottom'].includes(position)
  }

  addBar (position = 'left', options = {}) {
    try {
      // Validate position
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: left, right, top, bottom'

      // Check that bar is not already defined
      if (this.bars[position]) throw 'Bar with position \'' + position + '\' is already defined'

      // Create new bar object
      const bar = new OffCanvasBar(options)
      bar.parentElement = this.mainWrap
      bar.position = position
      bar.init()

      // Insert new bar
      this.bars[position] = bar

      this.debug('Added bar with position \'' + position + '\'')
    } catch (error) {
      this.logError(error)
    }

    return this
  }

  open (position = null) {
    try {
      if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: left, right, top, bottom'

      const bar = this.bars[position]

      if (!bar) throw 'Bar with position \'' + position + '\' is not defined'
      if (bar.element.classList.contains('offcanvas-bar--open')) return

      // Close other bars
      this.close()

      // Open bar
      bar.element.classList.add('offcanvas-bar--open')
      this.debug('Opening bar \'' + position + '\'')

      if (bar.options.mode && bar.options.mode == 'push') {
        let transform = ''

        switch (bar.position) {
          case 'left':
            this.contentWrap.style.transform = 'translateX(' + bar.element.offsetWidth + 'px)'
            this.mainWrap.style.overflowX = 'hidden'
            break

          case 'right':
            this.contentWrap.style.transform = 'translateX(-' + bar.element.offsetWidth + 'px)'
            this.mainWrap.style.overflowX = 'hidden'
            break

          case 'top':
            this.contentWrap.style.transform = 'translateY(' + bar.element.offsetHeight + 'px)'
            this.mainWrap.style.overflowY = 'hidden'
            break

          case 'bottom':
            this.contentWrap.style.transform = 'translateY(-' + bar.element.offsetHeight + 'px)'
            this.mainWrap.style.overflowY = 'hidden'
            break
        }
      }

      // Show overlay
      this.showOverlay()
    } catch (error) {
      this.logError(error)
    }

    return this
  }

  close () {
    try {
      Object.keys(this.bars).forEach(position => {
        const bar = this.bars[position]

        if (!bar) throw 'Bar with position \'' + position + '\' is not defined'
        if (!bar.element.classList.contains('offcanvas-bar--open')) return

        bar.element.classList.remove('offcanvas-bar--open')
        this.debug('Closing bar \'' + position + '\'')
      })

      this.contentWrap.style.transform = null
      this.mainWrap.style.overflowX = null
      this.mainWrap.style.overflowY = null

      this.hideOverlay()
    } catch (error) {
      this.logError(error)
    }

    return this
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

  // init () {
  // 	try {
  // 		// Validate required elements
  // 		if (!this.body) throw this.error('Body element was not found with selector: ' + this.options.bodySelector)
  // 		if (!this.bar) throw this.error('Bar element was not found with selector: ' + this.options.barSelector)
  // 		if (!this.page) throw this.error('Page element was not found with selector: ' + this.options.pageSelector)

  // 		// Get all focusable elements inside off-canvas bar
  // 		// We need to prevent focus from these elements when bar is closed
  // 		this.barFocusableElements = this.bar.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')

  // 		// Initially close bar
  // 		this.closeBar()

  // 		// Add event listeners to toggle buttons
  // 		this.openButtons.forEach(button => {
  // 			button.addEventListener('click', () => this.openBar(button))
  // 			button.addEventListener('keydown', event => {
  // 				if ([13, 32].indexOf(event.keyCode) > -1) {
  // 					event.preventDefault()
  // 					this.openBar(button)
  // 				}
  // 			})
  // 		})

  // 		this.closeButtons.forEach(button => {
  // 			button.addEventListener('click', () => this.closeBar())
  // 			button.addEventListener('keydown', event => {
  // 				if ([13, 32].indexOf(event.keyCode) > -1) {
  // 					event.preventDefault()
  // 					this.closeBar()
  // 				}
  // 			})
  // 		})

  // 		this.toggleButtons.forEach(button => {
  // 			button.addEventListener('click', () => this.toggleBar(button))
  // 			button.addEventListener('keydown', event => {
  // 				if ([13, 32].indexOf(event.keyCode) > -1) {
  // 					event.preventDefault()
  // 					this.toggleBar(button)
  // 				}
  // 			})
  // 		})
  // 	} catch (e) {
  // 		console.error(e)
  // 	}
  // }

  // openBar (button = null) {
  // 	if (this.isOpen) return

  // 	this.body.classList.add('offCanvas-open')

  // 	// Enable focus on all bar child elements
  // 	this.barFocusableElements.forEach(item => {
  // 		item.removeAttribute('tabindex')
  // 	})

  // 	// Focus on bar
  // 	this.bar.removeAttribute('aria-hidden')
  // 	this.bar.setAttribute('tabindex', '0')
  // 	this.bar.focus()

  // 	// Remember the button which was used to open off-canvas
  // 	this.previousOpenButton = button

  // 	this.isOpen = true
  // }

  // closeBar () {
  // 	this.body.classList.remove('offCanvas-open')

  // 	// Prevent focus on all bar child elements
  // 	this.barFocusableElements.forEach(item => {
  // 		item.setAttribute('tabindex', '-1')
  // 	})

  // 	// Prevent focus on bar
  // 	this.bar.setAttribute('tabindex', '-1')
  // 	this.bar.setAttribute('aria-hidden', 'true')

  // 	// Focus open button which was used to open off-canvas
  // 	if (this.previousOpenButton) this.previousOpenButton.focus()

  // 	this.previousOpenButton = null
  // 	this.isOpen = false
  // }

  // toggleBar (button = null) {
  // 	if (this.isOpen) {
  // 		this.closeBar()
  // 	} else {
  // 		this.openBar(button)
  // 	}
  // }

}

class OffCanvasBar {

  constructor(options) {
    this.options = Object.assign({
      selector: '',
      focusableElementSelector: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      mode: 'float',
    }, options)

    this.parentElement = null
    this.element = null
    this.position = null
  }

  isValidMode(mode = '') {
    return ['float', 'push', 'slide'].includes(mode)
  }

  init () {
    // Validate required properties
    if (!this.position) throw 'Missing position for bar'
    if (!this.parentElement) throw 'Missing parent element for bar with position \'' + this.position + '\''
    if (!this.options.selector) throw 'Missing element selector for bar with position \'' + this.position + '\''

    // Check that defined bar element exists
    this.element = this.parentElement.querySelector(this.options.selector)
    if (!this.element) throw 'Bar element was not found with selector: ' + this.options.selector

    // Validate mode
    if (!this.isValidMode(this.options.mode)) throw 'Invalid mode \'' + this.options.mode + '\' for bar \'' + this.position + '\'. Use one of the following values: float, push, slide.'

    // Insert attributes
    this.element.classList.add('offcanvas-bar')
    this.element.setAttribute('data-offcanvas-bar-position', this.position)

    return this
  }

}