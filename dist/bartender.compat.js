'use strict';
/**
 * Class for creating accessible off-canvas bars.
 */

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bartender = /*#__PURE__*/function () {
  /**
   * @param {object} options - User defined options
   */
  function Bartender(options) {
    _classCallCheck(this, Bartender);

    // Polyfill custom events
    if (typeof window.CustomEvent !== 'function') {
      window.CustomEvent = function (event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: null
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      };
    } // Apply user configuration


    this.options = _extends({
      // Debug mode
      debug: false,
      // Show shading overlay over content wrapper when bar is open?
      overlay: true,
      // Close open bar by clicking the overlay?
      closeOnOverlayClick: true,
      // Close open bar with escape key?
      closeOnEsc: true,
      // Trap focus to the open bar?
      trapFocus: false,
      // Scroll bar to the top when opening it?
      scrollTop: true,
      // Selector to find main wrapper
      mainWrapSelector: '.bartender-main',
      // Selector to find content wrapper
      contentWrapSelector: '.bartender-content',
      // Selector for focusable elements
      focusableElementSelector: '[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
      // Classes
      readyClass: 'bartender-ready',
      openClass: 'bartender-open'
    }, options); // Overlay element

    this.overlay = null; // Currently open bar

    this.currentOpenBar = null; // Button which was previously used to open the bar

    this.previousOpenButton = null; // Window resize timeout

    this.resizeTimeout = null; // Object for storing the bars

    this.bars = {}; // Arrays for storing buttons

    this.openButtons = [];
    this.closeButtons = [];
    this.toggleButtons = []; // Array for storing pushable elements
    // These elements will be moved when bar with "push" or "reveal" mode is being opened.

    this.pushElements = []; // Valid bar positions

    this.validBarPositions = ['left', 'right', 'top', 'bottom']; // Valid bar modes

    this.validModes = ['float', 'push', 'reveal']; // Mutation observer for content wrap

    this.contentWrapMutationObserver = null; // Run initializer

    this.init();
  }
  /**
   * Log to console
   *
   * @param {string} text - Text to log
   * @returns {void}
   */


  _createClass(Bartender, [{
    key: "log",
    value: function log() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      console.log('Bartender: ' + text);
    }
    /**
     * Log error to console
     *
     * @param {string} text - Text to log
     * @returns {void}
     */

  }, {
    key: "logError",
    value: function logError() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      console.error('Bartender: ' + text);
    }
    /**
     * Log debug message to console
     *
     * @param {string} text - Text to log
     * @returns {void}
     */

  }, {
    key: "debug",
    value: function debug() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      if (!this.options.debug) return;
      console.log('Bartender debug: ' + text);
    }
    /**
     * Disable focus of elements
     *
     * @param {array} Array of DOM elements
     * @returns {void}
     */

  }, {
    key: "disableFocus",
    value: function disableFocus() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var startTime = performance.now();
      var iterationCount = 0;

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i]; // Discard element if it's not focusable, or if it's already disabled

        if (!element.matches(this.options.focusableElementSelector) || element.getAttribute('data-bartender-prevtabindex')) continue;
        element.setAttribute('data-bartender-prevtabindex', element.getAttribute('tabindex'));
        element.setAttribute('tabindex', '-1');
        iterationCount++;
      }

      var endTime = performance.now();

      if (iterationCount > 0) {
        this.debug('Disabled focus of ' + iterationCount + ' elements in ' + (endTime - startTime));
      }
    }
    /**
     * Enable focus of elements
     *
     * @param {array} Array of DOM elements
     * @returns {void}
     */

  }, {
    key: "enableFocus",
    value: function enableFocus() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var startTime = performance.now();
      var iterationCount = 0;

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i]; // If element has previous tabindex marked, return it. Otherwise just remove tabindex attribute.

        if (element.getAttribute('data-bartender-prevtabindex') != 'null') {
          element.setAttribute('tabindex', element.getAttribute('data-bartender-prevtabindex'));
        } else {
          element.removeAttribute('tabindex');
        }

        element.removeAttribute('data-bartender-prevtabindex');
        iterationCount++;
      }

      var endTime = performance.now();

      if (iterationCount > 0) {
        this.debug('Enabled focus of ' + iterationCount + ' elements in ' + (endTime - startTime));
      }
    }
    /**
     * Is defined bar position valid?
     *
     * @param {string} position - Position to validate
     * @returns {boolean}
     */

  }, {
    key: "isValidPosition",
    value: function isValidPosition() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.validBarPositions.indexOf(position) >= 0;
    }
    /**
     * Initialize Bartender
     *
     * @returns {object} Bartender instance
     */

  }, {
    key: "init",
    value: function init() {
      var _this = this;

      try {
        // Find and validate required elements
        this.mainWrap = document.querySelector(this.options.mainWrapSelector);
        if (!this.mainWrap) throw 'Main wrap element was not found with selector: ' + this.options.mainWrapSelector;
        this.contentWrap = this.mainWrap.querySelector(this.options.contentWrapSelector);
        if (!this.contentWrap) throw 'Content wrap element was not found with selector: ' + this.options.contentWrapSelector; // Find buttons

        this.openButtons = this.mainWrap.querySelectorAll('[data-bartender-open]');
        this.closeButtons = this.mainWrap.querySelectorAll('[data-bartender-close]');
        this.toggleButtons = this.mainWrap.querySelectorAll('[data-bartender-toggle]'); // Add classes

        this.mainWrap.classList.add('bartender-main');
        this.contentWrap.classList.add('bartender-content');
        this.contentWrap.setAttribute('tabindex', '-1'); // Find bars

        var bars = this.mainWrap.querySelectorAll('[data-bartender-bar]');

        for (var i = 0; i < bars.length; i++) {
          this.addBar(bars[i]);
        } // Open buttons


        var _loop = function _loop(_i) {
          var button = _this.openButtons[_i];
          var position = button.getAttribute('data-bartender-open');

          if (!_this.isValidPosition(position)) {
            _this.logError('Open button has invalid bar position \'' + position + '\' defined. Use one of the following values: ' + _this.validBarPositions.join(', '));

            return {
              v: void 0
            };
          }

          button.setAttribute('aria-expanded', 'false');
          button.addEventListener('click', function () {
            _this.open(position, button);
          });
        };

        for (var _i = 0; _i < this.openButtons.length; _i++) {
          var _ret = _loop(_i);

          if (_typeof(_ret) === "object") return _ret.v;
        } // Toggle buttons


        var _loop2 = function _loop2(_i2) {
          var button = _this.toggleButtons[_i2];
          var position = button.getAttribute('data-bartender-toggle');

          if (!_this.isValidPosition(position)) {
            _this.logError('Toggle button has invalid bar position \'' + position + '\' defined. Use one of the following values: ' + _this.validBarPositions.join(', '));

            return {
              v: void 0
            };
          }

          button.setAttribute('aria-expanded', 'false');
          button.addEventListener('click', function () {
            _this.toggle(position, button);
          });
        };

        for (var _i2 = 0; _i2 < this.toggleButtons.length; _i2++) {
          var _ret2 = _loop2(_i2);

          if (_typeof(_ret2) === "object") return _ret2.v;
        } // Close buttons


        for (var _i3 = 0; _i3 < this.closeButtons.length; _i3++) {
          var button = this.closeButtons[_i3];
          button.addEventListener('click', function () {
            _this.close();
          });
        } // Find pushable elements


        this.pushElements = this.mainWrap.querySelectorAll('[data-bartender-push]');
        if (this.pushElements.length) this.debug('Registered ' + this.pushElements.length + ' pushable elements.'); // Add overlay

        if (this.options.overlay && !this.overlay) {
          this.overlay = document.createElement('div');
          this.overlay.classList.add('bartender-overlay');

          if (this.options.closeOnOverlayClick === true) {
            this.overlay.addEventListener('click', function () {
              return _this.close();
            });
          }

          this.contentWrap.appendChild(this.overlay);
        } // Enable closing the bar with escape key


        if (this.options.closeOnEsc) {
          window.addEventListener('keydown', function (event) {
            var key = event.key || event.keyCode;

            if (key === 'Escape' || key === 'Esc' || key === 27) {
              _this.close();
            }
          });
        } // Adjust content wrapper transform when window is resized


        window.addEventListener('resize', function () {
          clearTimeout(_this.resizeTimeout);
          _this.resizeTimeout = setTimeout(function () {
            _this.setPush();
          }, 200);
        }); // Add mutation observer for content wrapper

        if (this.options.trapFocus === true) {
          this.contentWrapMutationObserver = new MutationObserver(function (mutationsList) {
            if (!_this.currentOpenBar) return;

            for (var _i4 = 0; _i4 < mutationsList.length; _i4++) {
              var mutation = mutationsList[_i4];

              if (mutation.type === 'childList') {
                if (mutation.addedNodes && mutation.addedNodes.length) {
                  _this.disableFocus(mutation.addedNodes);
                }
              }
            }
          });
          this.contentWrapMutationObserver.observe(this.contentWrap, {
            attributes: false,
            childList: true,
            subtree: true
          });
        } // Add class to the main wrap


        this.mainWrap.classList.add(this.options.readyClass);
      } catch (error) {
        this.logError(error);
      }

      return this;
    }
    /**
     * Add a new off-canvas bar
     *
     * @param {object} element - DOM element. If undefined, the element will be created.
     * @param {object} options - Bar options
     * @returns {object} Added bar instance
     */

  }, {
    key: "addBar",
    value: function addBar() {
      var _this2 = this;

      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        // If element doesn't exist, create it
        var newElement = false;

        if (element === null) {
          newElement = true;
          element = document.createElement('div');
        } // Initially remove transition


        element.style.transition = 'none'; // Get bar configuration

        var position = options.position || element.getAttribute('data-bartender-bar');
        var mode = options.mode || element.getAttribute('data-bartender-bar-mode'); // If mode is not specified, fall back to 'float'

        mode = mode || 'float'; // Validate configuration

        if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: ' + this.validBarPositions.join(', ');
        if (this.validModes.indexOf(mode) < 0) throw 'Invalid mode \'' + mode + '\' for bar \'' + position + '\'. Use one of the following values: ' + this.validModes.join(', ');
        if (this.bars[position]) throw 'Bar with position \'' + position + '\' is already defined'; // Initially disable focus of the bar and it's child elements

        element.setAttribute('tabindex', '-1');
        element.setAttribute('aria-hidden', 'true');
        this.disableFocus(element.querySelectorAll(this.options.focusableElementSelector)); // Set data-attributes

        element.setAttribute('data-bartender-bar', position);
        element.setAttribute('data-bartender-bar-mode', mode); // If element is new, append to main container

        if (newElement === true) this.mainWrap.appendChild(element); // Return transition

        setTimeout(function () {
          element.style.transition = null;
        }); // Create new bar object

        var newBar = {
          element: element,
          position: position,
          mode: mode,
          mutationObserver: new MutationObserver(function (mutationsList) {
            if (_this2.currentOpenBar && _this2.currentOpenBar.position === position) return;

            for (var i = 0; i < mutationsList.length; i++) {
              var mutation = mutationsList[i];

              if (mutation.type === 'childList') {
                if (mutation.addedNodes && mutation.addedNodes.length) {
                  _this2.disableFocus(mutation.addedNodes);
                }
              }
            }
          })
        };
        newBar.mutationObserver.observe(newBar.element, {
          attributes: false,
          childList: true,
          subtree: true
        });
        this.bars[position] = newBar;
        this.debug('Added bar \'' + position + '\' with mode \'' + mode + '\'');
        return newBar;
      } catch (error) {
        this.logError(error);
        return null;
      }
    }
    /**
     * Remove bar
     *
     * @param {string} position - Bar position to remove
     * @param {boolean} removeElement - Remove DOM element?
     * @returns {void}
     */

  }, {
    key: "removeBar",
    value: function removeBar() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var removeElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      try {
        // If this bar is currently open, close it first
        if (this.currentOpenBar && this.currentOpenBar.position === position) {
          this.close();
        } // Validate position


        if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: ' + this.validBarPositions.join(', ');
        if (!this.bars[position]) throw 'Bar with position \'' + position + '\' doesn\'t exist';

        if (removeElement === true) {
          this.mainWrap.removeChild(this.bars[position].element);
        }

        delete this.bars[position];
        this.debug('Removed bar with position \'' + position + '\'');
      } catch (error) {
        this.logError(error);
      }
    }
    /**
     * Open off-canvas bar
     *
     * @param {string} position - Bar position
     * @param {object} button - Button which was used to run this method
     * @returns {object} Opened bar instance
     */

  }, {
    key: "open",
    value: function open() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var button = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      try {
        // Validate position
        if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: ' + this.validBarPositions.join(', '); // Get bar instance

        var bar = this.bars[position];
        if (!bar) throw 'Bar with position \'' + position + '\' is not defined.'; // Close other bars

        if (this.currentOpenBar) {
          this.close(false);
        } else if (this.options.trapFocus === true) {
          this.disableFocus(this.contentWrap.querySelectorAll(this.options.focusableElementSelector));
        }

        this.contentWrap.setAttribute('aria-hidden', 'true');
        this.debug('Opening bar \'' + position + '\''); // Mark this bar as open

        this.currentOpenBar = bar;
        bar.element.classList.add('bartender-bar--open'); // Scroll to top

        if (this.options.scrollTop) {
          bar.element.scrollTop = 0;
        } // Focus on bar


        bar.element.removeAttribute('aria-hidden');
        this.enableFocus(bar.element.querySelectorAll(this.options.focusableElementSelector));
        bar.element.focus(); // Push elements

        this.setPush(); // Remember the button which was used to open the bar

        this.previousOpenButton = button; // Set ARIA attributes of the button

        if (button) button.setAttribute('aria-expanded', true); // Show overlay

        this.showOverlay(); // Add class to the main element

        this.mainWrap.classList.add(this.options.openClass); // Dispatch event

        this.mainWrap.dispatchEvent(new CustomEvent('bartender-open', {
          bubbles: true,
          detail: {
            bar: bar,
            button: button
          }
        }));
        return bar;
      } catch (error) {
        this.logError(error);
      }
    }
    /**
     * Toggle off-canvas bar
     *
     * @param {string} position - Bar position
     * @param {object} button - Button which was used to run this method
     * @returns {object} Toggled bar instance
     */

  }, {
    key: "toggle",
    value: function toggle() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var button = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      try {
        if (!this.isValidPosition(position)) throw 'Invalid bar position \'' + position + '\'. Use one of the following values: ' + this.validBarPositions.join(', ');

        if (this.currentOpenBar && this.currentOpenBar.position == position) {
          return this.close();
        } else {
          this.close();
          return this.open(position, button);
        }
      } catch (error) {
        this.logError(error);
      }
    }
    /**
     * Close any open off-canvas bar
     *
     * @param {boolean} enableFocusOfContentWrap - Enable focus of content wrap
     * @returns {object} Closed bar
     */

  }, {
    key: "close",
    value: function close() {
      var enableFocusOfContentWrap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      try {
        if (!this.currentOpenBar) return;
        var bar = this.bars[this.currentOpenBar.position];
        this.debug('Closing bar \'' + bar.position + '\''); // Dispatch event

        this.mainWrap.dispatchEvent(new CustomEvent('bartender-close', {
          bubbles: true,
          detail: {
            bar: bar
          }
        })); // Hide overlay

        this.hideOverlay(); // Remove transform from wrapper element

        this.contentWrap.style.removeProperty('transform'); // Remove transforms from pushable elements

        for (var i = 0; i < this.pushElements.length; i++) {
          this.pushElements[i].style.removeProperty('transform');
        } // Disable focus of bar element


        this.disableFocus(bar.element.querySelectorAll(this.options.focusableElementSelector));
        bar.element.setAttribute('tabindex', '-1');
        bar.element.setAttribute('aria-hidden', 'true'); // Enable focus on content element

        this.contentWrap.removeAttribute('aria-hidden');

        if (this.options.trapFocus === true && enableFocusOfContentWrap === true) {
          this.enableFocus(this.contentWrap.querySelectorAll(this.options.focusableElementSelector));
        } // Close the bar


        bar.element.classList.remove('bartender-bar--open');
        this.currentOpenBar = null; // Restore scrolling to the main wrap

        this.mainWrap.style.removeProperty('overflow'); // Remove class from the main wrap

        this.mainWrap.classList.remove(this.options.openClass); // Focus open button which was used to open the bar

        if (this.previousOpenButton && this.previousOpenButton.getAttribute('tabindex') >= 0) {
          this.previousOpenButton.focus();
          this.previousOpenButton.setAttribute('aria-expanded', 'false');
          this.previousOpenButton = null;
        } else if (enableFocusOfContentWrap === true) {
          // Bar was closed using keyboard or API. Focus on content wrapper instead.
          this.contentWrap.focus();
        }

        return bar;
      } catch (error) {
        this.logError(error);
      }
    }
    /**
     * Set transforms for pushable elements
     *
     * @returns {void}
     */

  }, {
    key: "setPush",
    value: function setPush() {
      if (!this.currentOpenBar || !this.currentOpenBar.mode) return;
      var transform = null; // Hide overflow of main wrapper
      // This has to be done first in order to get correct width/height

      this.mainWrap.style.overflow = 'hidden';

      switch (this.currentOpenBar.position) {
        case 'left':
          transform = 'translateX(' + this.currentOpenBar.element.offsetWidth + 'px)';
          break;

        case 'right':
          transform = 'translateX(-' + this.currentOpenBar.element.offsetWidth + 'px)';
          break;

        case 'top':
          transform = 'translateY(' + this.currentOpenBar.element.offsetHeight + 'px)';
          break;

        case 'bottom':
          transform = 'translateY(-' + this.currentOpenBar.element.offsetHeight + 'px)';
          break;
      }

      if (['push', 'reveal'].indexOf(this.currentOpenBar.mode) >= 0) {
        // Transform content wrapper
        this.contentWrap.style.transform = transform;
      } // Transform other pushable elements


      for (var i = 0; i < this.pushElements.length; i++) {
        this.pushElements[i].style.transform = transform;
      }
    }
    /**
     * Show shading overlay
     *
     * @returns {void}
     */

  }, {
    key: "showOverlay",
    value: function showOverlay() {
      if (!this.overlay) return;
      if (this.overlay.classList.contains('bartender-overlay--visible')) return;
      this.overlay.classList.add('bartender-overlay--visible');
    }
    /**
     * Hide shading overlay
     *
     * @returns {void}
     */

  }, {
    key: "hideOverlay",
    value: function hideOverlay() {
      if (!this.overlay) return;
      if (!this.overlay.classList.contains('bartender-overlay--visible')) return;
      this.overlay.classList.remove('bartender-overlay--visible');
    }
  }]);

  return Bartender;
}();
//# sourceMappingURL=bartender.compat.js.map
