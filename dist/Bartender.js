var v = Object.defineProperty;
var g = Object.getOwnPropertySymbols;
var y = Object.prototype.hasOwnProperty, E = Object.prototype.propertyIsEnumerable;
var m = (r, e, t) => e in r ? v(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, c = (r, e) => {
  for (var t in e || (e = {}))
    y.call(e, t) && m(r, t, e[t]);
  if (g)
    for (var t of g(e))
      E.call(e, t) && m(r, t, e[t]);
  return r;
};
var i = (r, e, t) => (m(r, typeof e != "symbol" ? e + "" : e, t), t);
var l = (r, e, t) => new Promise((s, a) => {
  var h = (o) => {
    try {
      u(t.next(o));
    } catch (b) {
      a(b);
    }
  }, d = (o) => {
    try {
      u(t.throw(o));
    } catch (b) {
      a(b);
    }
  }, u = (o) => o.done ? s(o.value) : Promise.resolve(o.value).then(h, d);
  u((t = t.apply(r, e)).next());
});
import { Queue as _ } from "async-await-queue";
import { debounce as T } from "ts-debounce";
import * as B from "focus-trap";
const p = (r, e = document, t = !1) => r ? r instanceof Element ? r : typeof r == "string" ? t ? e.querySelector(`:scope > ${r}`) : e.querySelector(r) : null : null, w = (r = 100) => new Promise((e) => r ? setTimeout(e, r) : e()), f = () => typeof window == "undefined" ? null : (document.documentElement.style.setProperty("--dvh", `${window.innerHeight * 0.01}px`), window.innerHeight * 0.01);
class n extends Error {
  /**
   * @param {string} message - Error message
   */
  constructor(e) {
    super(e), this.name = "Bartender error";
  }
}
class O {
  /**
   * Create a new overlay
   *
   * @param {string} name - Overlay object name
   * @param {boolean} enabled - Enable overlay?
   */
  constructor(e, t = !0) {
    /** @property {boolean} _name - Overlay object name */
    i(this, "_name", "");
    /** @property {boolean} _enabled - Enable overlay? */
    i(this, "_enabled", !0);
    /** @property {HTMLElement} el - Overlay element */
    i(this, "el");
    this.el = document.createElement("div"), this.el.classList.add("bartender__overlay");
    try {
      this.name = e;
    } catch (s) {
      throw s instanceof DOMException ? new n(`Name '${e}' is not valid HTML class name`) : new n(s);
    }
    this.enabled = t;
  }
  /**
   * Destroy overlay instance
   *
   * @returns {this}
   */
  destroy() {
    return this.el.remove(), this;
  }
  /** @type {string} */
  get name() {
    return this._name;
  }
  /** @type {string} */
  set name(e) {
    this.el.classList.remove(`bartender__overlay--${this._name}`), this.el.classList.add(`bartender__overlay--${e}`), this._name = e;
  }
  /** @type {boolean} */
  get enabled() {
    return this._enabled;
  }
  /** @type {boolean} */
  set enabled(e) {
    e === !0 ? this.el.classList.remove("bartender__overlay--transparent") : this.el.classList.add("bartender__overlay--transparent"), this._enabled = e;
  }
  /**
   * Show overlay
   *
   * @returns {this}
   */
  show() {
    return this.el.classList.add("bartender__overlay--visible"), this;
  }
  /**
   * Hide overlay
   *
   * @returns {this}
   */
  hide() {
    return this.el.classList.remove("bartender__overlay--visible"), this;
  }
}
class L {
  /**
   * Create a new bar
   *
   * @param {string} name - Unique name of the bar
   * @param {object} options - Bar options
   * @throws {BartenderError}
   */
  constructor(e, t = {}) {
    /** @property {boolean} debug - Enable debug mode? */
    i(this, "debug", !1);
    /** @property {boolean} initialized - Is bar initialized? */
    i(this, "initialized", !1);
    /** @property {Overlay} overlayObj - Overlay object for the bar */
    i(this, "overlayObj");
    /** @property {string} _name - Bar name */
    i(this, "_name", "");
    /** @property {HTMLElement} el - Bar element */
    i(this, "el");
    /** @property {string} _position - Bar position */
    i(this, "_position", "left");
    /** @property {string} _mode - Bar mode */
    i(this, "_mode", "float");
    /** @property {boolean} _overlay - Enable overlay? */
    i(this, "_overlay", !0);
    /** @property {boolean} _permanent - Enable permanent mode? */
    i(this, "_permanent", !1);
    /** @property {boolean} _scrollTop - Scroll to the top when bar is opened? */
    i(this, "_scrollTop", !0);
    /** @property {boolean} focusTrap - Enable focus trap? */
    i(this, "_focusTrap", !1);
    /** @property {boolean} isOpened - Is the bar currently open? */
    i(this, "isOpened", !1);
    /** @property {object|null} trap - Focus trap */
    i(this, "trap");
    var a, h, d, u, o, b;
    if (!e)
      throw new n("Bar name is required");
    this.overlayObj = new O(e, this.overlay), this.name = e;
    const s = p(t.el || null);
    if (!s)
      throw new n(`Content element for bar '${this.name}' is required`);
    this.el = s, this.el.classList.add("bartender__bar", "bartender__bar--closed"), this.el.setAttribute("tabindex", "-1"), this.el.setAttribute("aria-hidden", "true"), this.position = (a = t.position) != null ? a : this._position, this.mode = (h = t.mode) != null ? h : this._mode, this.overlay = (d = t.overlay) != null ? d : this._overlay, this.permanent = (u = t.permanent) != null ? u : this._permanent, this.scrollTop = (o = t.scrollTop) != null ? o : this._scrollTop, this.focusTrap = (b = t.focusTrap) != null ? b : this.focusTrap, this.trap = B.createFocusTrap(this.el, {
      initialFocus: this.el,
      fallbackFocus: () => this.el,
      escapeDeactivates: !1,
      clickOutsideDeactivates: !1,
      allowOutsideClick: !0,
      returnFocusOnDeactivate: !1,
      preventScroll: !0
    }), this.initialized = !0;
  }
  /**
   * Destroy bar instance
   *
   * @returns {this}
   */
  destroy() {
    return this.trap && this.trap.deactivate(), this.overlayObj.destroy(), this.el.classList.remove("bartender__bar", `bartender__bar--${this.position}`), this;
  }
  /** @type {string} */
  get name() {
    return this._name;
  }
  /** @type {string} */
  set name(e) {
    this._name = e, this.overlayObj.name = e, this.initialized !== !1 && (this.el.dispatchEvent(new CustomEvent("bartender-bar-updated", {
      bubbles: !0,
      detail: {
        bar: this,
        property: "name",
        value: e
      }
    })), this.debug && console.debug("Updated bar name", this));
  }
  /** @type {string} */
  get position() {
    return this._position;
  }
  /**
   * @type {string}
   * @throws {BartenderError}
   */
  set position(e) {
    if (!e)
      throw new n(`Position is required for bar '${this.name}'`);
    const t = [
      "left",
      "right",
      "top",
      "bottom"
    ];
    if (!t.includes(e))
      throw new n(`Invalid position '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`);
    this.el.classList.add("bartender-disable-transition"), this.el.classList.remove(`bartender__bar--${this._position}`), this.el.classList.add(`bartender__bar--${e}`), this._position = e, setTimeout(() => {
      this.el.classList.remove("bartender-disable-transition");
    }), this.initialized !== !1 && (this.el.dispatchEvent(new CustomEvent("bartender-bar-updated", {
      bubbles: !0,
      detail: {
        bar: this,
        property: "position",
        value: e
      }
    })), this.debug && console.debug("Updated bar position", this));
  }
  /** @type {string} */
  get mode() {
    return this._mode;
  }
  /**
   * @type {string}
   * @throws {BartenderError}
   */
  set mode(e) {
    if (!e)
      throw new n(`Mode is required for bar '${this.name}'`);
    const t = [
      "float",
      "push",
      "reveal"
    ];
    if (!t.includes(e))
      throw new n(`Invalid mode '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`);
    this.el.classList.add("bartender-disable-transition"), this.el.classList.remove(`bartender__bar--${this._mode}`), this.el.classList.add(`bartender__bar--${e}`), this._mode = e, setTimeout(() => {
      this.el.classList.remove("bartender-disable-transition");
    }), this.initialized !== !1 && (this.el.dispatchEvent(new CustomEvent("bartender-bar-updated", {
      bubbles: !0,
      detail: {
        bar: this,
        property: "mode",
        value: this._mode
      }
    })), this.debug && console.debug("Updated bar mode", this));
  }
  /** @type {boolean} */
  get overlay() {
    return this._overlay;
  }
  /** @type {boolean} */
  set overlay(e) {
    this._overlay = e, this.overlayObj.enabled = e, this.initialized !== !1 && (this.el.dispatchEvent(new CustomEvent("bartender-bar-updated", {
      bubbles: !0,
      detail: {
        bar: this,
        property: "overlay",
        value: e
      }
    })), this.debug && console.debug("Updated bar overlay", this, this.overlayObj));
  }
  /** @type {boolean} */
  get permanent() {
    return this._permanent;
  }
  /** @type {boolean} */
  set permanent(e) {
    this._permanent = e, this.initialized !== !1 && (this.el.dispatchEvent(new CustomEvent("bartender-bar-updated", {
      bubbles: !0,
      detail: {
        bar: this,
        property: "permanent",
        value: e
      }
    })), this.debug && console.debug("Updated bar permanence", this));
  }
  /** @type {boolean} */
  get scrollTop() {
    return this._scrollTop;
  }
  /** @type {boolean} */
  set scrollTop(e) {
    this._scrollTop = e, this.initialized !== !1 && (this.el.dispatchEvent(new CustomEvent("bartender-bar-updated", {
      bubbles: !0,
      detail: {
        bar: this,
        property: "scrollTop",
        value: e
      }
    })), this.debug && console.debug("Updated bar scrollTop", this));
  }
  /** @type {boolean} */
  get focusTrap() {
    return this._focusTrap;
  }
  /** @type {boolean} */
  set focusTrap(e) {
    if (this._focusTrap = e, this.initialized !== !1 && (this.el.dispatchEvent(new CustomEvent("bartender-bar-updated", {
      bubbles: !0,
      detail: {
        bar: this,
        property: "focusTrap",
        value: e
      }
    })), this.debug && console.debug("Updated bar focusTrap", this), this.isOpened !== !1)) {
      if (e === !0) {
        this.trap.activate();
        return;
      }
      this.trap.deactivate();
    }
  }
  /**
   * Is bar currently open?
   *
   * @returns {boolean}
   */
  isOpen() {
    return this.isOpened;
  }
  /**
   * Get transition duration in milliseconds
   *
   * @returns {number}
   */
  getTransitionDuration() {
    if (!this.el)
      return 0;
    const e = window.getComputedStyle(this.el).getPropertyValue("transition-duration") || "0s";
    return parseFloat(e) * 1e3;
  }
  /**
   * Open bar
   *
   * @returns {Promise<this>}
   */
  open() {
    return l(this, null, function* () {
      return this.debug && console.debug("Opening bar", this), this.el.dispatchEvent(new CustomEvent("bartender-bar-before-open", {
        bubbles: !0,
        detail: { bar: this }
      })), this.scrollTop === !0 && this.el.scrollTo(0, 0), this.el.classList.remove("bartender__bar--closed"), this.el.classList.add("bartender__bar--open"), this.el.setAttribute("aria-hidden", "false"), this.el.focus(), this.overlayObj.show(), this.isOpened = !0, this.focusTrap === !0 && this.trap.activate(), yield w(this.getTransitionDuration()), this.el.dispatchEvent(new CustomEvent("bartender-bar-after-open", {
        bubbles: !0,
        detail: { bar: this }
      })), this.debug && console.debug("Finished opening bar", this), Promise.resolve(this);
    });
  }
  /**
   * Close bar
   *
   * @returns {Promise<this>}
   */
  close() {
    return l(this, null, function* () {
      return this.debug && console.debug("Closing bar", this), this.el.dispatchEvent(new CustomEvent("bartender-bar-before-close", {
        bubbles: !0,
        detail: { bar: this }
      })), this.el.classList.remove("bartender__bar--open"), this.el.setAttribute("aria-hidden", "true"), this.overlayObj.hide(), this.isOpened = !1, this.trap && this.trap.deactivate(), yield w(this.getTransitionDuration()), this.el.classList.add("bartender__bar--closed"), this.el.dispatchEvent(new CustomEvent("bartender-bar-after-close", {
        bubbles: !0,
        detail: { bar: this }
      })), this.debug && console.debug("Finished closing bar", this), Promise.resolve(this);
    });
  }
  /**
   * Get styles for pushable elements
   *
   * @returns {object}
   */
  getPushStyles() {
    return !this.position || !this.el ? {
      transform: "",
      transitionDuration: "",
      transitionTimingFunction: ""
    } : {
      transform: {
        left: `translateX(${this.el.offsetWidth}px)`,
        right: `translateX(-${this.el.offsetWidth}px)`,
        top: `translateY(${this.el.offsetHeight}px)`,
        bottom: `translateY(-${this.el.offsetHeight}px)`
      }[this.position] || "",
      transitionDuration: window.getComputedStyle(this.el).getPropertyValue("transition-duration") || "",
      transitionTimingFunction: window.getComputedStyle(this.el).getPropertyValue("transition-timing-function") || ""
    };
  }
}
class $ {
  /**
   * Create a new pushable element
   *
   * @param {BartenderElementQuery} el - Pushable element
   * @param {object} options - Options for pushable element
   * @throws {BartenderError}
   */
  constructor(e, t = {}) {
    /** @property {HTMLElement} el - Element to push */
    i(this, "el");
    /** @property {Bar[]} bars - Matched bars */
    i(this, "bars");
    /** @property {string[]} modes - Matched modes */
    i(this, "modes");
    /** @property {string[]} positions - Matched positions */
    i(this, "positions");
    /** @property {boolean} isPushed - Is the element currently pushed? */
    i(this, "isPushed", !1);
    const s = p(e || null);
    if (!s)
      throw new n("Element is required for push element");
    this.el = s, this.bars = t.bars || [], this.modes = t.modes || [], this.positions = t.positions || [];
  }
  /**
   * Push element
   *
   * @param {Bar} bar - The bar to match against push element properties
   * @param {object} pushStyles - Push styles from the bar
   * @returns {this}
   */
  push(e, t) {
    return this.bars.length && !this.bars.includes(e) || this.modes.length && !this.modes.includes(e.mode) || this.positions.length && !this.positions.includes(e.position) ? (this.el.style.transform = "", this.el.style.transitionTimingFunction = "", this.el.style.transitionDuration = "", this.isPushed = !1, this) : (this.el.style.transform = t.transform, this.el.style.transitionTimingFunction = t.transitionTimingFunction, this.el.style.transitionDuration = t.transitionDuration, this.isPushed = !0, this);
  }
  /**
   * Pull element and return it to the original position
   *
   * @param {object} pushStyles - Push styles from the bar
   * @returns {this}
   */
  pull(e) {
    return this.isPushed === !1 ? this : (this.el.style.transform = "translateX(0) translateY(0)", this.el.style.transitionTimingFunction = e.transitionTimingFunction, this.el.style.transitionDuration = e.transitionDuration, this.isPushed = !1, this);
  }
}
class z {
  /**
   * Create a new Bartender instance
   *
   * @param {object} options - Instance options
   * @param {object} barOptions - Default options for bars
   * @throws {BartenderError}
   */
  constructor(e = {}, t = {}) {
    /** @property {boolean} debug - Enable debug mode? */
    i(this, "_debug", !1);
    /** @property {HTMLElement} el - Main element */
    i(this, "el");
    /** @property {HTMLElement} contentEl - Content element */
    i(this, "contentEl");
    /** @property {number} switchTimeout - Time to wait in milliseconds until another bar is opened */
    i(this, "switchTimeout", 150);
    /** @property {Bar[]} bars - Bars added to the instance */
    i(this, "bars", []);
    /** @property {object} barDefaultOptions - Default options for the bars */
    i(this, "barDefaultOptions", {
      el: null,
      position: "left",
      mode: "float",
      overlay: !0,
      permanent: !1,
      scrollTop: !0,
      focusTrap: !1
    });
    /** @property {HTMLElement|null} returnFocus - Reference to the element to which focus will be restored after closing the bar */
    i(this, "returnFocus", null);
    /** @property {PushElement[]} pushableElements - Pushable elements added to the instance */
    i(this, "pushableElements", []);
    /** @property {object} queue - Queue for actions */
    i(this, "queue");
    /** @property {Function} resizeDebounce - Debouncer for resizing */
    i(this, "resizeDebounce");
    /** @property {Function} resizeDebounce - Debouncer for resizing */
    i(this, "onBarUpdateHandler");
    /** @property {Function} onKeydownHandler - Handler for keydown event */
    i(this, "onKeydownHandler");
    /** @property {Function} onKeydownHandler - Handler for resize event */
    i(this, "onResizeHandler");
    var h, d;
    f(), document.addEventListener("DOMContentLoaded", () => {
      f();
    }), this.debug = (h = e.debug) != null ? h : this._debug, this.switchTimeout = (d = e.switchTimeout) != null ? d : this.switchTimeout, this.barDefaultOptions = c(c({}, this.barDefaultOptions), t);
    const s = p(e.el || ".bartender");
    if (!s)
      throw new n("Main element is required");
    this.el = s, this.el.classList.add("bartender");
    const a = p(e.contentEl || ".bartender__content");
    if (!a)
      throw new n("Content element is required");
    if (a.parentElement !== this.el)
      throw new n("Content element must be a direct child of the main element");
    this.contentEl = a, this.contentEl.classList.add("bartender__content"), this.contentEl.setAttribute("tabindex", "-1"), this.addPushElement(this.contentEl, {
      modes: [
        "push",
        "reveal"
      ]
    }), this.queue = new _(1), this.resizeDebounce = T(() => {
      f(), this.pushElements(this.getOpenBar());
    }, 100), this.onBarUpdateHandler = this.onBarUpdate.bind(this), window.addEventListener("bartender-bar-updated", this.onBarUpdateHandler), this.onKeydownHandler = this.onKeydown.bind(this), window.addEventListener("keydown", this.onKeydownHandler), this.onResizeHandler = this.onResize.bind(this), window.addEventListener("resize", this.onResizeHandler), this.el.classList.add("bartender--ready"), this.el.dispatchEvent(new CustomEvent("bartender-init", {
      bubbles: !0,
      detail: { bartender: this }
    })), this.debug && console.debug("Bartender initialized", this);
  }
  /** @type {boolean} */
  get debug() {
    return this._debug;
  }
  /** @type {boolean} */
  set debug(e) {
    this._debug = e;
    for (const t of this.bars)
      t.debug = e;
  }
  /**
   * Destroy Bartender instance
   *
   * @returns {Promise<this>}
   */
  destroy() {
    return l(this, null, function* () {
      yield this.close();
      const e = this.bars.reduce((t, s) => (t.push(s.name), t), []);
      for (const t of e)
        this.getBar(t) && (yield this.removeBar(t));
      return this.el.classList.remove("bartender", "bartender--ready"), this.contentEl.classList.remove("bartender__content"), window.removeEventListener("bartender-bar-updated", this.onBarUpdateHandler), window.removeEventListener("keydown", this.onKeydownHandler), window.removeEventListener("resize", this.onResizeHandler), this.el.dispatchEvent(new CustomEvent("bartender-destroyed", {
        bubbles: !0,
        detail: { bartender: this }
      })), this.debug && console.debug("Bartender destroyed", this), Promise.resolve(this);
    });
  }
  /**
   * Get bar by name
   *
   * @param {string} name - Bar name
   * @returns {object|null}
   */
  getBar(e) {
    return this.bars.find((t) => t.name === e) || null;
  }
  /**
   * Get currently open bar
   *
   * @returns {object|null}
   */
  getOpenBar() {
    return this.bars.find((e) => e.isOpen() === !0) || null;
  }
  /**
   * Add a new bar
   *
   * @param {string} name - Unique name for the bar
   * @param {object} options - Bar options
   * @throws {BartenderError}
   * @returns {object} Bar object
   */
  addBar(e, t = {}) {
    if (!e || typeof e != "string")
      throw new n("Bar name is required");
    if (this.getBar(e))
      throw new n(`Bar with name '${e}' is already defined`);
    const s = new L(e, c(c({}, this.barDefaultOptions), t));
    if (s.debug = this.debug, this.bars.some((a) => a.el === s.el))
      throw new n(`Element of bar '${s.name}' is already being used for another bar`);
    if (s.el.parentElement !== this.el)
      throw new n(`Element of bar '${s.name}' must be a direct child of the Bartender main element`);
    return this.el.appendChild(s.overlayObj.el), s.overlayObj.el.addEventListener("click", () => {
      s.permanent !== !0 && this.close();
    }), this.addPushElement(s.overlayObj.el, {
      bars: [
        s
      ]
    }), this.bars.push(s), this.el.dispatchEvent(new CustomEvent("bartender-bar-added", {
      bubbles: !0,
      detail: { bar: s }
    })), this.debug && console.debug("Added a new bar", s), s;
  }
  /**
   * Remove bar
   *
   * @param {string} name - Bar name
   * @throws {BartenderError}
   * @returns {Promise<this>}
   */
  removeBar(e) {
    return l(this, null, function* () {
      if (!e || typeof e != "string")
        throw new n("Bar name is required");
      const t = this.getBar(e);
      if (!t)
        throw new n(`Bar with name '${e}' was not found`);
      this.getOpenBar() === t && this.close(), this.removePushElement(t.overlayObj.el), t.destroy();
      const s = this.bars.findIndex((a) => a.name === e);
      return this.bars.splice(s, 1), this.el.dispatchEvent(new CustomEvent("bartender-bar-removed", {
        bubbles: !0,
        detail: { name: e }
      })), this.debug && console.debug(`Removed bar '${e}'`), Promise.resolve(this);
    });
  }
  /**
   * Open bar
   *
   * @param {string} name - Bar name
   * @throws {BartenderError}
   * @returns {Promise<Bar>}
   */
  openBar(e) {
    return l(this, null, function* () {
      const t = this.getBar(e);
      if (!t)
        throw new n(`Unknown bar '${e}'`);
      if (t.isOpen() === !0)
        return Promise.resolve(t);
      const s = this.getOpenBar();
      return s && (yield this.closeBar(s.name, !0), yield w(this.switchTimeout)), this.el.classList.add("bartender--open"), this.contentEl.setAttribute("aria-hidden", "true"), this.pushElements(t), t.open();
    });
  }
  /**
   * Open bar
   *
   * @param {string} name - Bar name
   * @param {HTMLElement|null} returnFocus - Reference to the element to which focus will be restored after closing the bar
   * @returns {Promise<Bar>}
   */
  open(e, t) {
    return l(this, null, function* () {
      const s = Symbol();
      return yield this.queue.wait(s), this.returnFocus = t, this.openBar(e).finally(() => {
        this.queue.end(s);
      });
    });
  }
  /**
   * Close bar
   *
   * @param {string} name - Bar name
   * @param {boolean} switching - Will another bar open immediately after closing?
   * @returns {Promise<Bar|null>}
   */
  closeBar(e, t = !1) {
    return l(this, null, function* () {
      const s = e ? this.getBar(e) : this.getOpenBar();
      return !s || !s.isOpen() ? Promise.resolve(null) : (this.pullElements(s), yield s.close(), t === !1 && (this.el.classList.remove("bartender--open"), this.contentEl.setAttribute("aria-hidden", "false")), Promise.resolve(s));
    });
  }
  /**
   * Close bar
   *
   * @param {string} name - Bar name
   * @returns {Promise<Bar|null>}
   */
  close(e) {
    return l(this, null, function* () {
      const t = Symbol();
      return yield this.queue.wait(t), this.closeBar(e).finally(() => {
        if (this.queue.end(t), this.returnFocus) {
          this.returnFocus.focus(), this.returnFocus = null;
          return;
        }
        this.contentEl.focus();
      });
    });
  }
  /**
   * Toggle bar
   *
   * @param {string} name - Bar name
   * @param {HTMLElement|null} returnFocus - Reference to the element to which focus will be restored after closing the bar
   * @throws {BartenderError}
   * @returns {Promise<Bar|null>}
   */
  toggle(e, t) {
    return l(this, null, function* () {
      const s = this.getBar(e);
      if (!s)
        throw new n(`Unknown bar '${e}'`);
      return s.isOpen() === !0 ? this.close() : this.open(e, t);
    });
  }
  /**
   * Add a new pushable element
   *
   * @param {BartenderElementQuery} el - Pushable element
   * @param {object} options - Options for pushable element
   * @returns {PushElement}
   */
  addPushElement(e, t = {}) {
    if (this.pushableElements.some((a) => a.el === e))
      throw new n("This element is already defined as pushable element.");
    const s = new $(e, t);
    return this.pushableElements.push(s), this.debug && console.debug("Added a new pushable element", s), s;
  }
  /**
   * Remove pushable element
   *
   * @param {Element} el - Element to remove
   * @throws {BartenderError}
   * @returns {PushElement[]}
   */
  removePushElement(e) {
    const t = this.pushableElements.findIndex((s) => s.el === e);
    if (t === -1)
      throw new n("Pushable element was not found");
    return this.debug && console.debug("Removed pushable element", this.pushableElements[t]), this.pushableElements.splice(t, 1), this.pushableElements;
  }
  /**
   * Push elements
   *
   * @param {Bar|null} bar - The bar from which the styles are fetched
   * @returns {PushElement[]}
   */
  pushElements(e) {
    if (!e || !this.pushableElements.length)
      return this.pushableElements;
    const t = e.getPushStyles();
    for (const s of this.pushableElements)
      s.push(e, t);
    return this.pushableElements;
  }
  /**
   * Pull elements and return them to the original position
   *
   * @param {Bar|null} bar - The bar from which the styles are fetched
   * @returns {PushElement[]}
   */
  pullElements(e) {
    if (!e || !this.pushableElements.length)
      return this.pushableElements;
    const t = e.getPushStyles();
    for (const s of this.pushableElements)
      s.pull(t);
    return this.pushableElements;
  }
  /**
   * Handler for bartender-bar-updated event
   *
   * @returns {void}
   */
  onBarUpdate() {
    this.pushElements(this.getOpenBar());
  }
  /**
   * Handler for keydown event
   *
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  onKeydown(e) {
    if (e.key === "Escape") {
      const t = this.getOpenBar();
      if (!t || t.permanent === !0)
        return;
      this.close();
    }
  }
  /**
   * Handler for resize event
   *
   * @returns {void}
   */
  onResize() {
    this.resizeDebounce();
  }
}
export {
  z as Bartender
};
//# sourceMappingURL=Bartender.js.map
