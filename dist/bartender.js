class i extends Error {
  constructor(e) {
    super(e), this.name = "Bartender error";
  }
}
class u extends CustomEvent {
  constructor(e, t) {
    super(e, t);
  }
}
class o extends CustomEvent {
  constructor(e, t) {
    super(e, t);
  }
}
class a extends CustomEvent {
  constructor(e, t) {
    super(e, t);
  }
}
class c extends CustomEvent {
  constructor(e, t) {
    super(e, t);
  }
}
const b = (s) => Object.entries(s).reduce(
  (e, [t, r]) => (typeof r > "u" || (e[t] = r), e),
  {}
), p = (s, e = document) => s instanceof Element ? s : typeof s == "string" ? e.querySelector(s) : null, h = (s = 100) => new Promise((e) => s ? setTimeout(e, s) : e());
class l {
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
  constructor(e, t = {}) {
    if (!e)
      throw new i("Bar name is required");
    this.name = e;
    const r = p(t.el || null);
    if (!r)
      throw new i(`Element for bar '${this.name}' is required`);
    if (r.tagName !== "DIALOG")
      throw new i(
        `Bar element for '${this.name}' must be a <dialog> element`
      );
    this.el = r, this.el.classList.add("bartender-bar", "bartender-bar--closed"), this.position = t.position ?? this._position, this.modal = t.modal ?? this._modal, this.overlay = t.overlay ?? this._overlay, this.permanent = t.permanent ?? this._permanent, this.scrollTop = t.scrollTop ?? this._scrollTop, this.onCloseHandler = async (n) => {
      this.debug && console.debug("Closing bar", this), this.el.dispatchEvent(
        new o("bartender-bar-before-close", {
          bubbles: !0,
          detail: { bar: this }
        })
      ), this.el.classList.remove("bartender-bar--open"), this.isOpened = !1, await h(this.getTransitionDuration()), this.el.classList.add("bartender-bar--closed"), this.el.dispatchEvent(
        new o("bartender-bar-after-close", {
          bubbles: !0,
          detail: { bar: this }
        })
      ), this.debug && console.debug("Finished closing bar", this);
    }, this.onClickHandler = (n) => {
      const d = this.el.getBoundingClientRect();
      this.permanent === !1 && (d.left > n.clientX || d.right < n.clientX || d.top > n.clientY || d.bottom < n.clientY) && (n.stopPropagation(), this.el.dispatchEvent(
        new o("bartender-bar-backdrop-click", {
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
      new a("bartender-bar-updated", {
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
    const t = [
      "left",
      "right",
      "top",
      "bottom",
      "center"
    ];
    if (!t.includes(e))
      throw new i(
        `Invalid position '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`
      );
    this.el.classList.remove(`bartender-bar--position-${this._position}`), this.el.classList.add(`bartender-bar--position-${e}`), this._position = e, this.initialized !== !1 && (this.el.dispatchEvent(
      new a("bartender-bar-updated", {
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
    const t = this._modal === !0 ? "modal" : "standard", r = e === !0 ? "modal" : "standard";
    this.el.classList.remove(`bartender-bar--mode-${t}`), this.el.classList.add(`bartender-bar--mode-${r}`), this._modal = e, this.initialized !== !1 && (this.el.dispatchEvent(
      new a("bartender-bar-updated", {
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
      new a("bartender-bar-updated", {
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
      new a("bartender-bar-updated", {
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
      new a("bartender-bar-updated", {
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
      new o("bartender-bar-before-open", {
        bubbles: !0,
        detail: { bar: this }
      })
    ), this.debug && console.debug("Opening bar", this), this.modal === !0 ? this.el.showModal() : this.el.show(), this.scrollTop === !0 && this.scrollToTop(), this.el.classList.remove("bartender-bar--closed"), this.el.classList.add("bartender-bar--open"), this.isOpened = !0, await h(this.getTransitionDuration()), this.debug && console.debug("Finished opening bar", this), this.el.dispatchEvent(
      new o("bartender-bar-after-open", {
        bubbles: !0,
        detail: { bar: this }
      })
    ), this;
  }
  /**
   * Close bar
   */
  async close() {
    return this.el.close(), await h(this.getTransitionDuration()), this;
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
class f {
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
  constructor(e = {}, t = {}) {
    this.debug = e.debug ?? this._debug, this.barDefaultOptions = {
      ...this.barDefaultOptions,
      ...b(t)
    }, this.onKeydownHandler = ((r) => {
      if (r.key === "Escape" && this.getOpenBar(!0)?.permanent === !0) {
        r.preventDefault();
        return;
      }
    }).bind(this), this.onBarBeforeOpenHandler = (r) => {
      this.openBars.push(r.detail.bar), this.openBars.some((n) => n.modal === !0) && document.body.classList.add("bartender-disable-scroll"), document.body.classList.add("bartender-open");
    }, this.onBarBeforeCloseHandler = (r) => {
      this.openBars.splice(this.openBars.indexOf(r.detail.bar), 1), this.openBars.length || document.body.classList.remove("bartender-open"), this.openBars.some((n) => n.modal === !0) || document.body.classList.remove("bartender-disable-scroll");
    }, this.onBarBackdropClickHandler = (r) => {
      this.getOpenBar(!0)?.name === r.detail.bar.name && this.close(r.detail.bar.name);
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
      new u("bartender-init", {
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
    for (const t of this.bars)
      t.debug = e;
  }
  /**
   * Get bar instance by name.
   */
  getBar(e) {
    return this.bars.find((t) => t.name === e) || null;
  }
  /**
   * Get the topmost open bar instance.
   */
  getOpenBar(e = void 0) {
    const t = typeof e == "boolean" ? this.openBars.filter((r) => r.modal === e) : this.openBars;
    return t.length ? t[t.length - 1] : null;
  }
  /**
   * Add a new bar
   */
  addBar(e, t = {}) {
    if (!e)
      throw new i("Bar name is required");
    if (this.getBar(e))
      throw new i(`Bar with name '${e}' is already defined`);
    const r = new l(e, {
      ...this.barDefaultOptions,
      ...b(t)
    });
    if (r.debug = this.debug, this.bars.some((n) => n.el === r.el))
      throw new i(
        `Element of bar '${r.name}' is already being used for another bar`
      );
    return this.bars.push(r), window.dispatchEvent(
      new o("bartender-bar-added", {
        detail: { bar: r }
      })
    ), this.debug && console.debug("Added a new bar", r), r;
  }
  /**
   * Remove bar instance by name
   */
  removeBar(e) {
    if (!e)
      throw new i("Bar name is required");
    const t = this.getBar(e);
    if (!t)
      throw new i(`Bar with name '${e}' was not found`);
    return t.isOpen() === !0 && this.close(e), t.destroy(), this.bars.splice(
      this.bars.findIndex((r) => r.name === e),
      1
    ), window.dispatchEvent(
      new c("bartender-bar-removed", {
        detail: { name: e }
      })
    ), this.debug && console.debug(`Removed bar '${e}'`), this;
  }
  /**
   * Open bar
   *
   * Resolves after the bar has opened.
   */
  async open(e, t = !1) {
    const r = e instanceof l ? e : typeof e == "string" ? this.getBar(e) : null;
    if (!r)
      throw new i(`Unknown bar '${e}'`);
    return r.isOpen() === !0 || (t === !1 && this.closeAll(), await r.open()), r;
  }
  /**
   * Close bar
   *
   * If bar is undefined, the topmost bar will be closed. Resolves after the bar has closed.
   */
  async close(e) {
    const t = e ? e instanceof l ? e : typeof e == "string" ? this.getBar(e) : null : this.getOpenBar();
    return !t || !t.isOpen() ? null : (await t.close(), t);
  }
  /**
   * Close all bars
   *
   * Resolves after all the bars have been closed.
   */
  async closeAll(e = !1) {
    const t = this.openBars.reduce((r, n) => (e === !1 && n.modal === !1 || r.push(n.name), r), []);
    return await Promise.all(
      t.map((r) => this.close(r))
    ), this;
  }
  /**
   * Toggle bar open/closed state.
   *
   * Resolves after the bar has opened or closed.
   */
  async toggle(e, t = !1) {
    const r = e instanceof l ? e : typeof e == "string" ? this.getBar(e) : null;
    if (!r)
      throw new i(`Unknown bar '${e}'`);
    return r.isOpen() === !0 ? await this.close(r) : await this.open(r, t);
  }
  /**
   * Destroy Bartender instance
   */
  destroy() {
    this.closeAll();
    const e = this.bars.flatMap((t) => t.name);
    for (const t of e)
      this.getBar(t) && this.removeBar(t);
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
      new u("bartender-destroyed", {
        detail: { bartender: this }
      })
    ), this.debug && console.debug("Bartender destroyed", this), this;
  }
}
export {
  f as Bartender,
  l as BartenderBar
};
//# sourceMappingURL=bartender.js.map
