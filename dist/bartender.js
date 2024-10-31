class i extends Error {
  constructor(e) {
    super(e), this.name = "Bartender error";
  }
}
const l = (n) => Object.entries(n).reduce(
  (e, [r, t]) => (typeof t > "u" || (e[r] = t), e),
  {}
), h = (n, e = document) => n instanceof Element ? n : typeof n == "string" ? e.querySelector(n) : null, d = (n = 100) => new Promise((e) => n ? setTimeout(e, n) : e());
class o {
  /** Enable debug mode? */
  debug = !1;
  /** Is bar initialized? */
  initialized = !1;
  /** Bar name */
  _name = "";
  /** Bar element */
  el;
  /** Bar position */
  _position = "left";
  /** Is the bar a modal? */
  _modal = !0;
  /** Enable overlay? */
  _overlay = !0;
  /** Enable permanent mode? */
  _permanent = !1;
  /** Scroll to the top when bar is opened? */
  _scrollTop = !0;
  /** Is the bar currently open? */
  isOpened = !1;
  /** Handler for dialog close event */
  onCloseHandler;
  /** Handler for dialog click event */
  onClickHandler;
  /**
   * Create a new bar
   */
  constructor(e, r = {}) {
    if (!e)
      throw new i("Bar name is required");
    this.name = e;
    const t = h(r.el || null);
    if (!t)
      throw new i(`Element for bar '${this.name}' is required`);
    if (t.tagName !== "DIALOG")
      throw new i(
        `Bar element for '${this.name}' must be a <dialog> element`
      );
    this.el = t, this.el.classList.add("bartender-bar", "bartender-bar--closed"), this.position = r.position ?? this._position, this.modal = r.modal ?? this._modal, this.overlay = r.overlay ?? this._overlay, this.permanent = r.permanent ?? this._permanent, this.scrollTop = r.scrollTop ?? this._scrollTop, this.onCloseHandler = async (s) => {
      this.debug && console.debug("Closing bar", this), this.el.dispatchEvent(
        new CustomEvent("bartender-bar-before-close", {
          bubbles: !0,
          detail: { bar: this }
        })
      ), this.el.classList.remove("bartender-bar--open"), this.isOpened = !1, await d(this.getTransitionDuration()), this.el.classList.add("bartender-bar--closed"), this.el.dispatchEvent(
        new CustomEvent("bartender-bar-after-close", {
          bubbles: !0,
          detail: { bar: this }
        })
      ), this.debug && console.debug("Finished closing bar", this);
    }, this.onClickHandler = (s) => {
      const a = this.el.getBoundingClientRect();
      this.permanent === !1 && (a.left > s.clientX || a.right < s.clientX || a.top > s.clientY || a.bottom < s.clientY) && (s.stopPropagation(), this.el.dispatchEvent(
        new CustomEvent("bartender-bar-backdrop-click", {
          bubbles: !0,
          detail: {
            bar: this
          }
        })
      ));
    }, this.el.addEventListener("close", this.onCloseHandler), this.el.addEventListener("click", this.onClickHandler), this.initialized = !0;
  }
  /**
   * Destroy bar instance
   */
  destroy() {
    return this.el.classList.remove(
      "bartender-bar",
      `bartender-bar--position-${this.position}`
    ), this.el.removeEventListener("close", this.onCloseHandler), this.el.removeEventListener("click", this.onClickHandler), this;
  }
  /** Bar name */
  get name() {
    return this._name;
  }
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
  /** Bar position */
  get position() {
    return this._position;
  }
  set position(e) {
    if (!e)
      throw new i(`Position is required for bar '${this.name}'`);
    const r = [
      "left",
      "right",
      "top",
      "bottom"
    ];
    if (!r.includes(e))
      throw new i(
        `Invalid position '${e}' for bar '${this.name}'. Use one of the following: ${r.join(", ")}.`
      );
    this.el.classList.remove(`bartender-bar--position-${this._position}`), this.el.classList.add(`bartender-bar--position-${e}`), this._position = e, this.initialized !== !1 && (this.el.dispatchEvent(
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
  /** Is the bar a modal? */
  get modal() {
    return this._modal;
  }
  set modal(e) {
    this._modal = e, this.initialized !== !1 && (this.el.dispatchEvent(
      new CustomEvent("bartender-bar-updated", {
        bubbles: !0,
        detail: {
          bar: this,
          property: "modal",
          value: e
        }
      })
    ), this.debug && console.debug("Updated bar modal setting", this));
  }
  /** Enable overlay? */
  get overlay() {
    return this._overlay;
  }
  set overlay(e) {
    this._overlay = e, e === !0 ? this.el.classList.add("bartender-bar--has-overlay") : this.el.classList.remove("bartender-bar--has-overlay"), this.initialized !== !1 && (this.el.dispatchEvent(
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
  /** Enable permanent mode? */
  get permanent() {
    return this._permanent;
  }
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
  /** Scroll to the top when bar is opened? */
  get scrollTop() {
    return this._scrollTop;
  }
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
   */
  isOpen() {
    return this.isOpened;
  }
  /**
   * Open bar
   */
  async open() {
    return this.el.dispatchEvent(
      new CustomEvent("bartender-bar-before-open", {
        bubbles: !0,
        detail: { bar: this }
      })
    ), this.debug && console.debug("Opening bar", this), this.modal === !0 ? this.el.showModal() : this.el.show(), this.scrollTop === !0 && this.scrollToTop(), this.el.classList.remove("bartender-bar--closed"), this.el.classList.add("bartender-bar--open"), this.isOpened = !0, await d(this.getTransitionDuration()), this.debug && console.debug("Finished opening bar", this), this.el.dispatchEvent(
      new CustomEvent("bartender-bar-after-open", {
        bubbles: !0,
        detail: { bar: this }
      })
    ), this;
  }
  /**
   * Close bar
   */
  async close() {
    return this.el.close(), await d(this.getTransitionDuration()), this;
  }
  /**
   * Scroll bar to the top
   */
  scrollToTop() {
    return this.el.scrollTo(0, 0), this;
  }
  /**
   * Get transition duration in milliseconds
   */
  getTransitionDuration() {
    return parseFloat(window.getComputedStyle(this.el).transitionDuration || "0") * 1e3;
  }
}
class u {
  /** Enable debug mode? */
  _debug = !1;
  /** Bars added to the instance */
  bars = [];
  /** Currently open bars */
  openBars = [];
  /** Default options for the bars */
  barDefaultOptions = {
    el: null,
    position: "left",
    overlay: !0,
    permanent: !1,
    scrollTop: !0
  };
  /** Handler for keydown events */
  onKeydownHandler;
  /** Handler for bartender-bar-before-open events */
  onBarBeforeOpenHandler;
  /** Handler for bartender-bar-before-close events */
  onBarBeforeCloseHandler;
  /** Handler for bartender-bar-backdrop-click events */
  onBarBackdropClickHandler;
  /**
   * Create a new Bartender instance
   */
  constructor(e = {}, r = {}) {
    this.debug = e.debug ?? this._debug, this.barDefaultOptions = {
      ...this.barDefaultOptions,
      ...r
    }, this.onKeydownHandler = ((t) => {
      if (t.key === "Escape" && this.getOpenBar(!0)?.permanent === !0) {
        t.preventDefault();
        return;
      }
    }).bind(this), this.onBarBeforeOpenHandler = (t) => {
      this.openBars.push(t.detail.bar), this.openBars.some((s) => s.modal === !0) && document.body.classList.add("bartender-disable-scroll"), document.body.classList.add("bartender-open");
    }, this.onBarBeforeCloseHandler = (t) => {
      this.openBars.splice(this.openBars.indexOf(t.detail.bar), 1), this.openBars.length || document.body.classList.remove("bartender-open"), this.openBars.some((s) => s.modal === !0) || document.body.classList.remove("bartender-disable-scroll");
    }, this.onBarBackdropClickHandler = (t) => {
      this.getOpenBar(!0)?.name === t.detail.bar.name && this.close(t.detail.bar.name);
    }, typeof document < "u" && typeof window < "u" && (document.addEventListener(
      "keydown",
      this.onKeydownHandler
    ), document.addEventListener(
      "bartender-bar-before-open",
      this.onBarBeforeOpenHandler
    ), document.addEventListener(
      "bartender-bar-before-close",
      this.onBarBeforeCloseHandler
    ), document.addEventListener(
      "bartender-bar-backdrop-click",
      this.onBarBackdropClickHandler
    ), document.body.classList.add("bartender-ready"), window.dispatchEvent(
      new CustomEvent("bartender-init", {
        detail: { bartender: this }
      })
    ), this.debug && console.debug("Bartender initialized", this));
  }
  /** Enable debug mode? */
  get debug() {
    return this._debug;
  }
  set debug(e) {
    this._debug = e;
    for (const r of this.bars)
      r.debug = e;
  }
  /**
   * Get bar instance by name.
   */
  getBar(e) {
    return this.bars.find((r) => r.name === e) || null;
  }
  /**
   * Get the topmost open bar instance.
   */
  getOpenBar(e = void 0) {
    const r = typeof e == "boolean" ? this.openBars.filter((t) => t.modal === e) : this.openBars;
    return r.length ? r[r.length - 1] : null;
  }
  /**
   * Add a new bar
   */
  addBar(e, r = {}) {
    if (!e)
      throw new i("Bar name is required");
    if (this.getBar(e))
      throw new i(`Bar with name '${e}' is already defined`);
    const t = new o(e, {
      ...this.barDefaultOptions,
      ...l(r)
    });
    if (t.debug = this.debug, this.bars.some((s) => s.el === t.el))
      throw new i(
        `Element of bar '${t.name}' is already being used for another bar`
      );
    return this.bars.push(t), window.dispatchEvent(
      new CustomEvent("bartender-bar-added", {
        detail: { bar: t }
      })
    ), this.debug && console.debug("Added a new bar", t), t;
  }
  /**
   * Remove bar instance by name
   */
  removeBar(e) {
    if (!e)
      throw new i("Bar name is required");
    const r = this.getBar(e);
    if (!r)
      throw new i(`Bar with name '${e}' was not found`);
    return r.isOpen() === !0 && this.close(e), r.destroy(), this.bars.splice(
      this.bars.findIndex((t) => t.name === e),
      1
    ), window.dispatchEvent(
      new CustomEvent("bartender-bar-removed", {
        detail: { name: e }
      })
    ), this.debug && console.debug(`Removed bar '${e}'`), this;
  }
  /**
   * Open bar
   *
   * Resolves after the bar has opened.
   */
  async open(e, r = !1) {
    const t = e instanceof o ? e : typeof e == "string" ? this.getBar(e) : null;
    if (!t)
      throw new i(`Unknown bar '${e}'`);
    return t.isOpen() === !0 || (r === !1 && this.closeAll(), await t.open()), t;
  }
  /**
   * Close bar
   *
   * If bar is undefined, the topmost bar will be closed. Resolves after the bar has closed.
   */
  async close(e) {
    const r = e ? e instanceof o ? e : typeof e == "string" ? this.getBar(e) : null : this.getOpenBar();
    return !r || !r.isOpen() ? null : (await r.close(), r);
  }
  /**
   * Close all bars
   *
   * Resolves after all the bars have been closed.
   */
  async closeAll(e = !1) {
    const r = this.openBars.reduce((t, s) => (e === !1 && s.modal === !1 || t.push(s.name), t), []);
    return await Promise.all(
      r.map((t) => this.close(t))
    ), this;
  }
  /**
   * Toggle bar open/closed state.
   *
   * Resolves after the bar has opened or closed.
   */
  async toggle(e, r = !1) {
    const t = e instanceof o ? e : typeof e == "string" ? this.getBar(e) : null;
    if (!t)
      throw new i(`Unknown bar '${e}'`);
    return t.isOpen() === !0 ? await this.close(t) : await this.open(t, r);
  }
  /**
   * Destroy Bartender instance
   */
  destroy() {
    this.closeAll();
    const e = this.bars.flatMap((r) => r.name);
    for (const r of e)
      this.getBar(r) && this.removeBar(r);
    return document.body.classList.remove("bartender", "bartender-ready"), document.removeEventListener(
      "keydown",
      this.onKeydownHandler
    ), document.removeEventListener(
      "bartender-bar-before-open",
      this.onBarBeforeOpenHandler
    ), document.removeEventListener(
      "bartender-bar-before-close",
      this.onBarBeforeCloseHandler
    ), document.removeEventListener(
      "bartender-bar-backdrop-click",
      this.onBarBackdropClickHandler
    ), window.dispatchEvent(
      new CustomEvent("bartender-destroyed", {
        detail: { bartender: this }
      })
    ), this.debug && console.debug("Bartender destroyed", this), this;
  }
}
export {
  u as Bartender,
  o as BartenderBar
};
//# sourceMappingURL=bartender.js.map
