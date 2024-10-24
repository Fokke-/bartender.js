import { Queue as c } from "async-await-queue";
import { debounce as p } from "ts-debounce";
const u = (n, e = document, t = !1) => n ? n instanceof Element ? n : typeof n == "string" ? t ? e.querySelector(`:scope > ${n}`) : e.querySelector(n) : null : null, a = (n = 100) => new Promise((e) => n ? setTimeout(e, n) : e()), m = () => typeof window > "u" ? null : (document.documentElement.style.setProperty("--dvh", `${window.innerHeight * 0.01}px`), window.innerHeight * 0.01);
class i extends Error {
  /**
   * @param {string} message - Error message
   */
  constructor(e) {
    super(e), this.name = "Bartender error";
  }
}
class f {
  /** @property {boolean} debug - Enable debug mode? */
  debug = !1;
  /** @property {boolean} initialized - Is bar initialized? */
  initialized = !1;
  /** @property {string} _name - Bar name */
  _name = "";
  /** @property {HTMLDialogElement} el - Bar element */
  el;
  /** @property {string} _position - Bar position */
  _position = "left";
  /** @property {boolean} _overlay - Enable overlay? */
  _overlay = !0;
  /** @property {boolean} _permanent - Enable permanent mode? */
  _permanent = !1;
  /** @property {boolean} _scrollTop - Scroll to the top when bar is opened? */
  _scrollTop = !0;
  /** @property {boolean} isOpened - Is the bar currently open? */
  isOpened = !1;
  /** @property {Function} onCloseHandler - Handler for dialog close event */
  onCloseHandler;
  /** @property {Function} onClickHandler - Handler for dialog click event */
  onClickHandler;
  /**
   * Create a new bar
   *
   * @param {string} name - Unique name of the bar
   * @param {object} options - Bar options
   * @throws {BartenderError}
   */
  constructor(e, t = {}) {
    if (!e) throw new i("Bar name is required");
    this.name = e;
    const s = u(t.el || null);
    if (!s)
      throw new i(
        `Content element for bar '${this.name}' is required`
      );
    if (s.tagName !== "DIALOG")
      throw new i(
        `Bar element for '${this.name}' must be a <dialog> element`
      );
    this.el = s, this.el.classList.add("bartender-bar", "bartender-bar--closed"), this.position = t.position ?? this._position, this.overlay = t.overlay ?? this._overlay, this.permanent = t.permanent ?? this._permanent, this.scrollTop = t.scrollTop ?? this._scrollTop, this.onCloseHandler = this.onClose.bind(this), this.el.addEventListener("close", this.onCloseHandler), this.onClickHandler = this.onClick.bind(this), this.el.addEventListener("click", this.onClickHandler), this.initialized = !0;
  }
  /**
   * Destroy bar instance
   *
   * @returns {this}
   */
  destroy() {
    return this.el.classList.remove("bartender-bar", `bartender-bar--${this.position}`), this.el.removeEventListener("close", this.onCloseHandler), this.el.removeEventListener("click", this.onClickHandler), this;
  }
  /** @type {string} */
  get name() {
    return this._name;
  }
  /** @type {string} */
  set name(e) {
    this._name = e, this.initialized !== !1 && (this.el.dispatchEvent(
      new CustomEvent("bartender-bar-updated", {
        bubbles: !0,
        detail: {
          bar: this,
          property: "name",
          value: e
        }
      })
    ), this.debug && console.debug("Updated bar name", this));
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
      throw new i(`Position is required for bar '${this.name}'`);
    const t = [
      "left",
      "right",
      "top",
      "bottom"
    ];
    if (!t.includes(e))
      throw new i(
        `Invalid position '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`
      );
    this.el.classList.remove(`bartender-bar--${this._position}`), this.el.classList.add(`bartender-bar--${e}`), this._position = e, this.initialized !== !1 && (this.el.dispatchEvent(
      new CustomEvent("bartender-bar-updated", {
        bubbles: !0,
        detail: {
          bar: this,
          property: "position",
          value: e
        }
      })
    ), this.debug && console.debug("Updated bar position", this));
  }
  /** @type {boolean} */
  get overlay() {
    return this._overlay;
  }
  /** @type {boolean} */
  set overlay(e) {
    this._overlay = e, e === !0 ? this.el.classList.add("bartender-bar--overlay") : this.el.classList.remove("bartender-bar--overlay"), this.initialized !== !1 && (this.el.dispatchEvent(
      new CustomEvent("bartender-bar-updated", {
        bubbles: !0,
        detail: {
          bar: this,
          property: "overlay",
          value: e
        }
      })
    ), this.debug && console.debug("Updated bar overlay", this));
  }
  /** @type {boolean} */
  get permanent() {
    return this._permanent;
  }
  /** @type {boolean} */
  set permanent(e) {
    this._permanent = e, this.initialized !== !1 && (this.el.dispatchEvent(
      new CustomEvent("bartender-bar-updated", {
        bubbles: !0,
        detail: {
          bar: this,
          property: "permanent",
          value: e
        }
      })
    ), this.debug && console.debug("Updated bar permanence", this));
  }
  /** @type {boolean} */
  get scrollTop() {
    return this._scrollTop;
  }
  /** @type {boolean} */
  set scrollTop(e) {
    this._scrollTop = e, this.initialized !== !1 && (this.el.dispatchEvent(
      new CustomEvent("bartender-bar-updated", {
        bubbles: !0,
        detail: {
          bar: this,
          property: "scrollTop",
          value: e
        }
      })
    ), this.debug && console.debug("Updated bar scrollTop", this));
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
   * Get transition properties for an element
   *
   * @param {Element} el - Element to get properties for
   * @returns {BartenderTransitionProperties}
   */
  getTransitionProperties(e) {
    const t = {
      timingFunction: void 0,
      duration: 0
    };
    if (!e) return t;
    const s = window.getComputedStyle(e).getPropertyValue("transition-property") || "", r = window.getComputedStyle(e).getPropertyValue("transition-duration") || "", b = window.getComputedStyle(e).getPropertyValue("transition-timing-function") || "", l = s.split(",").map((o) => o.trim()).indexOf("transform");
    if (l < 0) return t;
    const h = r.split(",").map((o) => o.trim())[l];
    h && (t.duration = parseFloat(h) * 1e3);
    const d = b.split(",").map((o) => o.trim())[l];
    return d && (t.timingFunction = d), t;
  }
  /**
   * Open bar
   *
   * @returns {Promise<this>}
   */
  async open() {
    this.debug && console.debug("Opening bar", this), this.el.dispatchEvent(
      new CustomEvent("bartender-bar-before-open", {
        bubbles: !0,
        detail: { bar: this }
      })
    ), this.el.showModal(), this.scrollTop === !0 && this.el.scrollTo(0, 0), this.el.classList.remove("bartender-bar--closed"), this.el.classList.add("bartender-bar--open"), this.isOpened = !0;
    const { duration: e } = this.getTransitionProperties(this.el);
    return await a(e), this.el.dispatchEvent(
      new CustomEvent("bartender-bar-after-open", {
        bubbles: !0,
        detail: { bar: this }
      })
    ), this.debug && console.debug("Finished opening bar", this), Promise.resolve(this);
  }
  /**
   * Close bar
   *
   * @returns {Promise<this>}
   */
  async close() {
    this.el.close();
    const { duration: e } = this.getTransitionProperties(this.el);
    return await a(e), Promise.resolve(this);
  }
  /**
   * Handler for dialog close event
   *
   * @returns {Promise<this>}
   */
  async onClose() {
    this.debug && console.debug("Closing bar", this), this.el.dispatchEvent(
      new CustomEvent("bartender-bar-before-close", {
        bubbles: !0,
        detail: { bar: this }
      })
    ), this.el.classList.remove("bartender-bar--open"), this.isOpened = !1;
    const { duration: e } = this.getTransitionProperties(this.el);
    return await a(e), this.el.classList.add("bartender-bar--closed"), this.el.dispatchEvent(
      new CustomEvent("bartender-bar-after-close", {
        bubbles: !0,
        detail: { bar: this }
      })
    ), this.debug && console.debug("Finished closing bar", this), Promise.resolve(this);
  }
  /**
   * Handler for dialog click event
   *
   * @param {MouseEvent} event - Click event
   * @returns {Promise<this>}
   */
  onClick(e) {
    const t = this.el.getBoundingClientRect();
    return this.permanent === !1 && (t.left > e.clientX || t.right < e.clientX || t.top > e.clientY || t.bottom < e.clientY) && this.close(), Promise.resolve(this);
  }
  /**
   * Get styles for pushable elements
   *
   * @returns {Promise<BartenderPushStyles>}
   */
  async getPushStyles() {
    const e = {
      transform: "",
      transitionDuration: "",
      transitionTimingFunction: ""
    };
    if (!this.position || !this.el)
      return e;
    await new Promise((r) => requestAnimationFrame(r));
    const { duration: t, timingFunction: s } = this.getTransitionProperties(this.el);
    return e.transform = {
      left: `translateX(${this.el.offsetWidth}px)`,
      right: `translateX(-${this.el.offsetWidth}px)`,
      top: `translateY(${this.el.offsetHeight}px)`,
      bottom: `translateY(-${this.el.offsetHeight}px)`
    }[this.position] || "", e.transitionDuration = `${t}ms`, e.transitionTimingFunction = s || "", Promise.resolve(e);
  }
}
class g {
  /** @property {HTMLElement} el - Element to push */
  el;
  /** @property {Bar[]} bars - Matched bars */
  bars;
  /** @property {string[]} positions - Matched positions */
  positions;
  /** @property {boolean} isPushed - Is the element currently pushed? */
  isPushed = !1;
  /**
   * Create a new pushable element
   *
   * @param {BartenderElementQuery} el - Pushable element
   * @param {object} options - Options for pushable element
   * @throws {BartenderError}
   */
  constructor(e, t = {}) {
    const s = u(e || null);
    if (!s)
      throw new i("Element is required for push element");
    this.el = s, this.bars = t.bars || [], this.positions = t.positions || [];
  }
  /**
   * Push element
   *
   * @param {Bar} bar - The bar to match against push element properties
   * @param {object} pushStyles - Push styles from the bar
   * @returns {this}
   */
  push(e, t) {
    return this.bars.length && !this.bars.includes(e) || this.positions.length && !this.positions.includes(e.position) ? (this.el.style.transform = "", this.el.style.transitionTimingFunction = "", this.el.style.transitionDuration = "", this.isPushed = !1, this) : (this.el.style.transform = t.transform, this.el.style.transitionTimingFunction = t.transitionTimingFunction, this.el.style.transitionDuration = t.transitionDuration, this.isPushed = !0, this);
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
class y {
  /** @property {boolean} debug - Enable debug mode? */
  _debug = !1;
  /** @property {number} switchTimeout - Time to wait in milliseconds until another bar is opened */
  switchTimeout = 150;
  /** @property {Bar[]} bars - Bars added to the instance */
  bars = [];
  /** @property {object} barDefaultOptions - Default options for the bars */
  barDefaultOptions = {
    el: null,
    position: "left",
    overlay: !0,
    permanent: !1,
    scrollTop: !0
  };
  /** @property {boolean} Switching - Will another bar open immediately after the current bar is closed? */
  switching = !1;
  /** @property {PushElement[]} pushableElements - Pushable elements added to the instance */
  pushableElements = [];
  /** @property {object} queue - Queue for actions */
  queue;
  /** @property {Function} resizeDebounce - Debouncer for resizing */
  resizeDebounce;
  /** @property {Function} resizeDebounce - Debouncer for resizing */
  onBarUpdateHandler;
  /** @property {Function} onKeydownHandler - Handler for keydown event */
  onKeydownHandler;
  /** @property {Function} onKeydownHandler - Handler for resize event */
  onResizeHandler;
  /**
   * Create a new Bartender instance
   *
   * @param {object} options - Instance options
   * @param {object} barOptions - Default options for bars
   * @throws {BartenderError}
   */
  constructor(e = {}, t = {}) {
    this.debug = e.debug ?? this._debug, this.switchTimeout = e.switchTimeout ?? this.switchTimeout, this.barDefaultOptions = {
      ...this.barDefaultOptions,
      ...t
    }, this.queue = new c(1), this.resizeDebounce = p(() => {
      m(), this.pushElements(this.getOpenBar());
    }, 100), this.onBarUpdateHandler = this.onBarUpdate.bind(this), window.addEventListener("bartender-bar-updated", this.onBarUpdateHandler), this.onKeydownHandler = this.onKeydown.bind(this), document.addEventListener("keydown", this.onKeydownHandler), this.onResizeHandler = this.onResize.bind(this), window.addEventListener("resize", this.onResizeHandler), document.body.classList.add("bartender-ready"), window.dispatchEvent(
      new CustomEvent("bartender-init", {
        bubbles: !0,
        detail: { bartender: this }
      })
    ), this.debug && console.debug("Bartender initialized", this);
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
  async destroy() {
    await this.close();
    const e = this.bars.reduce((t, s) => (t.push(s.name), t), []);
    for (const t of e)
      this.getBar(t) && await this.removeBar(t);
    return document.body.classList.remove("bartender", "bartender-ready"), window.removeEventListener("bartender-bar-updated", this.onBarUpdateHandler), document.removeEventListener("keydown", this.onKeydownHandler), window.removeEventListener("resize", this.onResizeHandler), window.dispatchEvent(
      new CustomEvent("bartender-destroyed", {
        bubbles: !0,
        detail: { bartender: this }
      })
    ), this.debug && console.debug("Bartender destroyed", this), Promise.resolve(this);
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
      throw new i("Bar name is required");
    if (this.getBar(e))
      throw new i(`Bar with name '${e}' is already defined`);
    const s = new f(e, {
      ...this.barDefaultOptions,
      ...t
    });
    if (s.debug = this.debug, this.bars.some((r) => r.el === s.el))
      throw new i(
        `Element of bar '${s.name}' is already being used for another bar`
      );
    return s.el.addEventListener("bartender-bar-before-close", () => {
      this.pullElements(s);
    }), s.el.addEventListener("bartender-bar-after-close", () => {
      this.switching === !0 ? this.switching = !1 : document.body.classList.remove("bartender-open");
    }), this.bars.push(s), window.dispatchEvent(
      new CustomEvent("bartender-bar-added", {
        bubbles: !0,
        detail: { bar: s }
      })
    ), this.debug && console.debug("Added a new bar", s), s;
  }
  /**
   * Remove bar
   *
   * @param {string} name - Bar name
   * @throws {BartenderError}
   * @returns {this}
   */
  removeBar(e) {
    if (!e || typeof e != "string")
      throw new i("Bar name is required");
    const t = this.getBar(e);
    if (!t) throw new i(`Bar with name '${e}' was not found`);
    this.getOpenBar() === t && this.close(), t.destroy();
    const s = this.bars.findIndex((r) => r.name === e);
    return this.bars.splice(s, 1), window.dispatchEvent(
      new CustomEvent("bartender-bar-removed", {
        bubbles: !0,
        detail: { name: e }
      })
    ), this.debug && console.debug(`Removed bar '${e}'`), this;
  }
  /**
   * Open bar
   *
   * @param {string} name - Bar name
   * @throws {BartenderError}
   * @returns {Promise<Bar>}
   */
  async open(e) {
    const t = this.getBar(e);
    if (!t) throw new i(`Unknown bar '${e}'`);
    if (t.isOpen() === !0) return Promise.resolve(t);
    const s = Symbol();
    await this.queue.wait(s);
    const r = this.getOpenBar();
    return r && (await this.close(r.name, !0), await a(this.switchTimeout)), document.body.classList.add("bartender-open"), this.pushElements(t), await t.open().finally(() => {
      this.queue.end(s);
    }), t;
  }
  /**
   * Close bar
   *
   * @param {string|undefined} name - Bar name. Leave empty to close any open bar.
   * @param {boolean} _switching - For internal use only. Will another bar open immediately after closing?
   * @returns {Promise<Bar|null>}
   */
  async close(e, t = !1) {
    const s = e ? this.getBar(e) : this.getOpenBar();
    return !s || !s.isOpen() ? Promise.resolve(null) : (this.switching = t, await s.close(), Promise.resolve(s));
  }
  /**
   * Toggle bar
   *
   * @param {string} name - Bar name
   * @throws {BartenderError}
   * @returns {Promise<Bar|null>}
   */
  async toggle(e) {
    const t = this.getBar(e);
    if (!t) throw new i(`Unknown bar '${e}'`);
    return t.isOpen() === !0 ? await this.close() : await this.open(e);
  }
  /**
   * Add a new pushable element
   *
   * @param {BartenderElementQuery} el - Pushable element
   * @param {object} options - Options for pushable element
   * @returns {PushElement}
   */
  addPushElement(e, t = {}) {
    if (this.pushableElements.some((r) => r.el === e))
      throw new i(
        "This element is already defined as pushable element."
      );
    const s = new g(e, t);
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
    if (t === -1) throw new i("Pushable element was not found");
    return this.debug && console.debug("Removed pushable element", this.pushableElements[t]), this.pushableElements.splice(t, 1), this.pushableElements;
  }
  /**
   * Push elements
   *
   * @param {Bar|null} bar - The bar from which the styles are fetched
   * @returns {PushElement[]}
   */
  async pushElements(e) {
    if (!e || !this.pushableElements.length) return this.pushableElements;
    const t = await e.getPushStyles();
    for (const s of this.pushableElements)
      s.push(e, t);
    return Promise.resolve(this.pushableElements);
  }
  /**
   * Pull elements and return them to the original position
   *
   * @param {BartenderBar|null} bar - The bar from which the styles are fetched
   * @returns {PushElement[]}
   */
  async pullElements(e) {
    if (!e || !this.pushableElements.length) return this.pushableElements;
    const t = await e.getPushStyles();
    for (const s of this.pushableElements)
      s.pull(t);
    return Promise.resolve(this.pushableElements);
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
   * @param {KeyboardEvent} event - Keyboard event
   * @returns {void}
   */
  onKeydown(e) {
    if (e.key === "Escape") {
      const t = this.getOpenBar();
      if (t && t.permanent === !0) {
        e.preventDefault();
        return;
      }
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
  y as Bartender,
  f as BartenderBar
};
//# sourceMappingURL=Bartender.js.map
