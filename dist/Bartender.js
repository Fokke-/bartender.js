var v = Object.defineProperty;
var w = Object.getOwnPropertySymbols;
var y = Object.prototype.hasOwnProperty, E = Object.prototype.propertyIsEnumerable;
var m = (r, e, t) => e in r ? v(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, p = (r, e) => {
  for (var t in e || (e = {}))
    y.call(e, t) && m(r, t, e[t]);
  if (w)
    for (var t of w(e))
      E.call(e, t) && m(r, t, e[t]);
  return r;
};
var i = (r, e, t) => (m(r, typeof e != "symbol" ? e + "" : e, t), t);
var l = (r, e, t) => new Promise((s, n) => {
  var h = (o) => {
    try {
      u(t.next(o));
    } catch (c) {
      n(c);
    }
  }, d = (o) => {
    try {
      u(t.throw(o));
    } catch (c) {
      n(c);
    }
  }, u = (o) => o.done ? s(o.value) : Promise.resolve(o.value).then(h, d);
  u((t = t.apply(r, e)).next());
});
import { Queue as g } from "async-await-queue";
import { debounce as _ } from "ts-debounce";
const b = (r) => r ? typeof r == "string" ? document.querySelector(r) : r instanceof Element ? r : null : null, f = (r = 100) => new Promise((e) => r ? setTimeout(e, r) : e());
class a extends Error {
  constructor(e) {
    super(e), this.name = "Bartender error";
  }
}
class B {
  constructor(e, t = !0) {
    i(this, "_name", "");
    i(this, "_enabled", !0);
    i(this, "el");
    this.el = document.createElement("div"), this.el.classList.add("bartender__overlay");
    try {
      this.name = e;
    } catch (s) {
      throw s instanceof DOMException ? new a(`Name '${e}' is not valid HTML class name`) : new a(s);
    }
    this.enabled = t;
  }
  destroy() {
    return this.el.remove(), this;
  }
  get name() {
    return this._name;
  }
  set name(e) {
    this.el.classList.remove(`bartender__overlay--${this._name}`), this.el.classList.add(`bartender__overlay--${e}`), this._name = e;
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(e) {
    e === !0 ? this.el.classList.remove("bartender__overlay--transparent") : this.el.classList.add("bartender__overlay--transparent"), this._enabled = e;
  }
  show() {
    return this.el.classList.add("bartender__overlay--visible"), this;
  }
  hide() {
    return this.el.classList.remove("bartender__overlay--visible"), this;
  }
}
class O {
  constructor(e, t = {}) {
    i(this, "ready", !1);
    i(this, "overlayObj");
    i(this, "_name", "");
    i(this, "el");
    i(this, "_position", "left");
    i(this, "_mode", "float");
    i(this, "_overlay", !0);
    i(this, "_permanent", !1);
    i(this, "_scrollTop", !0);
    i(this, "isOpened", !1);
    var n, h, d, u, o;
    if (!e)
      throw "Bar name is required";
    this.overlayObj = new B(e, this.overlay), this.name = e;
    const s = b(t.el || null);
    if (!s)
      throw new a(`Content element for bar '${this.name}' is required`);
    this.el = s, this.el.classList.add("bartender__bar"), this.el.setAttribute("tabindex", "-1"), this.el.setAttribute("aria-hidden", "true"), this.position = (n = t.position) != null ? n : this.position, this.mode = (h = t.mode) != null ? h : this._mode, this.overlay = (d = t.overlay) != null ? d : this._overlay, this.permanent = (u = t.permanent) != null ? u : this._permanent, this.scrollTop = (o = t.scrollTop) != null ? o : this._scrollTop, this.ready = !0;
  }
  destroy(e = !1) {
    return e === !0 && this.el.remove(), this.overlayObj.destroy(), this;
  }
  get name() {
    return this._name;
  }
  set name(e) {
    this._name = e, this.overlayObj.name = e;
  }
  get position() {
    return this._position;
  }
  set position(e) {
    if (!e)
      throw `Position is required for bar '${this.name}'`;
    const t = [
      "left",
      "right",
      "top",
      "bottom"
    ];
    if (!t.includes(e))
      throw `Invalid position '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`;
    this.el.classList.add("bartender-disable-transition"), this.el.classList.remove(`bartender__bar--${this.position}`), this.el.classList.add(`bartender__bar--${e}`), this._position = e, setTimeout(() => {
      this.el.classList.remove("bartender-disable-transition");
    }), this.ready === !0 && this.el.dispatchEvent(new CustomEvent("bartender-bar-update", {
      bubbles: !0,
      detail: { bar: this }
    }));
  }
  get mode() {
    return this._mode;
  }
  set mode(e) {
    if (!e)
      throw `Mode is required for bar '${this.name}'`;
    const t = [
      "float",
      "push",
      "reveal"
    ];
    if (!t.includes(e))
      throw `Invalid mode '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`;
    this.el.classList.add("bartender-disable-transition"), this.el.classList.remove(`bartender__bar--${this.mode}`), this.el.classList.add(`bartender__bar--${e}`), this._mode = e, setTimeout(() => {
      this.el.classList.remove("bartender-disable-transition");
    }), this.ready === !0 && this.el.dispatchEvent(new CustomEvent("bartender-bar-update", {
      bubbles: !0,
      detail: { bar: this }
    }));
  }
  get overlay() {
    return this._overlay;
  }
  set overlay(e) {
    this.overlayObj.enabled = e, this._overlay = e, this.ready === !0 && this.el.dispatchEvent(new CustomEvent("bartender-bar-update", {
      bubbles: !0,
      detail: { bar: this }
    }));
  }
  get permanent() {
    return this._permanent;
  }
  set permanent(e) {
    this._permanent = e, this.ready === !0 && this.el.dispatchEvent(new CustomEvent("bartender-bar-update", {
      bubbles: !0,
      detail: { bar: this }
    }));
  }
  get scrollTop() {
    return this._scrollTop;
  }
  set scrollTop(e) {
    this._scrollTop = e, this.ready === !0 && this.el.dispatchEvent(new CustomEvent("bartender-bar-update", {
      bubbles: !0,
      detail: { bar: this }
    }));
  }
  isOpen() {
    return this.isOpened;
  }
  getTransitionDuration() {
    if (!this.el)
      return 0;
    const e = window.getComputedStyle(this.el).getPropertyValue("transition-duration") || "0s";
    return parseFloat(e) * 1e3;
  }
  open() {
    return l(this, null, function* () {
      return this.el.dispatchEvent(new CustomEvent("bartender-bar-before-open", {
        bubbles: !0,
        detail: { bar: this }
      })), this.scrollTop === !0 && this.el.scrollTo(0, 0), this.el.classList.add("bartender__bar--open"), this.el.setAttribute("aria-hidden", "false"), this.el.focus(), this.overlayObj.show(), this.isOpened = !0, yield f(this.getTransitionDuration()), this.el.dispatchEvent(new CustomEvent("bartender-bar-after-open", {
        bubbles: !0,
        detail: { bar: this }
      })), Promise.resolve(this);
    });
  }
  close() {
    return l(this, null, function* () {
      return this.el.dispatchEvent(new CustomEvent("bartender-bar-before-close", {
        bubbles: !0,
        detail: { bar: this }
      })), this.el.classList.remove("bartender__bar--open"), this.el.setAttribute("aria-hidden", "true"), this.overlayObj.hide(), this.isOpened = !1, yield f(this.getTransitionDuration()), this.el.dispatchEvent(new CustomEvent("bartender-bar-after-close", {
        bubbles: !0,
        detail: { bar: this }
      })), Promise.resolve(this);
    });
  }
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
class L {
  constructor(e = {}) {
    i(this, "el");
    i(this, "bars");
    i(this, "modes");
    i(this, "positions");
    i(this, "isPushed", !1);
    const t = b(e.el || null);
    if (!t)
      throw new a("Element is required for push element");
    this.el = t, this.bars = e.bars || [], this.modes = e.modes || [], this.positions = e.positions || [];
  }
  push(e, t) {
    return this.bars.length && !this.bars.includes(e) || this.modes.length && !this.modes.includes(e.mode) || this.positions.length && !this.positions.includes(e.position) ? (this.el.style.transform = "", this.el.style.transitionTimingFunction = "", this.el.style.transitionDuration = "", this.isPushed = !1, this) : (this.el.style.transform = t.transform, this.el.style.transitionTimingFunction = t.transitionTimingFunction, this.el.style.transitionDuration = t.transitionDuration, this.isPushed = !0, this);
  }
  pull(e) {
    return this.isPushed === !1 ? this : (this.el.style.transform = "translateX(0) translateY(0)", this.el.style.transitionTimingFunction = e.transitionTimingFunction, this.el.style.transitionDuration = e.transitionDuration, this.isPushed = !1, this);
  }
}
class C {
  constructor(e = {}, t = {}) {
    // TODO: add support for focus traps
    i(this, "debug", !1);
    i(this, "el");
    i(this, "contentEl");
    i(this, "switchTimeout", 150);
    i(this, "bars", []);
    i(this, "barDefaultOptions", {
      el: null,
      position: "left",
      mode: "float",
      overlay: !0,
      permanent: !1,
      scrollTop: !0
    });
    i(this, "previousOpenButton", null);
    i(this, "pushableElements", []);
    i(this, "queue");
    i(this, "resizeDebounce");
    i(this, "onBarUpdateHandler");
    i(this, "onKeydownHandler");
    i(this, "onResizeHandler");
    var h, d;
    this.debug = (h = e.debug) != null ? h : this.debug, this.switchTimeout = (d = e.switchTimeout) != null ? d : this.switchTimeout, this.barDefaultOptions = Object.assign(this.barDefaultOptions, t);
    const s = b(e.el || ".bartender");
    if (!s)
      throw new a("Main element is required");
    this.el = s, this.el.classList.add("bartender");
    const n = b(e.contentEl || ".bartender__content");
    if (!n)
      throw new a("Content element is required");
    if (n.parentElement !== this.el)
      throw new a("Content element must be a direct child of the main element");
    this.contentEl = n, this.contentEl.classList.add("bartender__content"), this.contentEl.setAttribute("tabindex", "-1"), this.addPushElement({
      el: this.contentEl,
      modes: [
        "push",
        "reveal"
      ]
    }), this.queue = new g(1), this.resizeDebounce = _(() => {
      this.pushElements(this.getOpenBar());
    }, 100), this.onBarUpdateHandler = this.onBarUpdate.bind(this), window.addEventListener("bartender-bar-update", this.onBarUpdateHandler), this.onKeydownHandler = this.onKeydown.bind(this), window.addEventListener("keydown", this.onKeydownHandler), this.onResizeHandler = this.onResize.bind(this), window.addEventListener("resize", this.onResizeHandler), this.el.classList.add("bartender--ready"), this.el.dispatchEvent(new CustomEvent("bartender-init", {
      bubbles: !0,
      detail: { bartender: this }
    }));
  }
  destroy(e = !1) {
    return l(this, null, function* () {
      const t = this.bars.reduce((s, n) => (s.push(n.name), s), []);
      for (const s of t)
        this.getBar(s) && (yield this.removeBar(s, e));
      return this.el.classList.remove("bartender", "bartender--ready"), this.contentEl.classList.remove("bartender__content"), window.removeEventListener("bartender-bar-update", this.onBarUpdateHandler), window.removeEventListener("keydown", this.onKeydownHandler), window.removeEventListener("resize", this.onResizeHandler), this.el.dispatchEvent(new CustomEvent("bartender-destroyed", {
        bubbles: !0,
        detail: { bartender: this }
      })), Promise.resolve(this);
    });
  }
  getBar(e) {
    return this.bars.find((t) => t.name === e) || null;
  }
  getOpenBar() {
    return this.bars.find((e) => e.isOpen() === !0) || null;
  }
  addBar(e, t = {}) {
    var n;
    if (!e || typeof e != "string")
      throw new a("Bar name is required");
    if (this.getBar(e))
      throw new a(`Bar with name '${e}' is already defined`);
    const s = new O(e, p(p({}, this.barDefaultOptions), t));
    if (s.el.parentElement !== this.el)
      throw new a(`Element of bar '${s.name}' must be a direct child of the Bartender main element`);
    return (n = this.contentEl) == null || n.appendChild(s.overlayObj.el), s.overlayObj.el.addEventListener("click", () => {
      s.permanent !== !0 && this.close();
    }), this.bars.push(s), this.el.dispatchEvent(new CustomEvent("bartender-bar-added", {
      bubbles: !0,
      detail: { bar: s }
    })), s;
  }
  removeBar(e, t = !1) {
    return l(this, null, function* () {
      if (!e || typeof e != "string")
        throw new a("Bar name is required");
      const s = this.getBar(e);
      if (!s)
        throw new a(`Bar with name '${e}' was not found`);
      this.getOpenBar() === s && (yield this.close()), s.destroy(t);
      const n = this.bars.findIndex((h) => h.name === e);
      return this.bars.splice(n, 1), this.el.dispatchEvent(new CustomEvent("bartender-bar-removed", {
        bubbles: !0,
        detail: { name: e }
      })), Promise.resolve(this);
    });
  }
  openBar(e) {
    return l(this, null, function* () {
      const t = this.getBar(e);
      if (!t)
        return Promise.reject(new a(`Unknown bar '${e}'`));
      if (t.isOpen() === !0)
        return Promise.resolve(t);
      const s = this.getOpenBar();
      return s && (yield this.closeBar(s.name, !0), yield f(this.switchTimeout)), this.el.classList.add("bartender--open"), this.contentEl.setAttribute("aria-hidden", "true"), this.pushElements(t), t.open();
    });
  }
  open(e, t) {
    return l(this, null, function* () {
      const s = Symbol();
      return yield this.queue.wait(s), this.previousOpenButton = t, this.openBar(e).finally(() => {
        this.queue.end(s);
      });
    });
  }
  closeBar(e, t = !1) {
    return l(this, null, function* () {
      const s = e ? this.getBar(e) : this.getOpenBar();
      return !s || !s.isOpen() ? Promise.resolve(null) : (this.pullElements(s), yield s.close(), t === !1 && (this.el.classList.remove("bartender--open"), this.contentEl.setAttribute("aria-hidden", "false")), Promise.resolve(s));
    });
  }
  close(e) {
    return l(this, null, function* () {
      const t = Symbol();
      return yield this.queue.wait(t), this.closeBar(e).finally(() => {
        this.queue.end(t), this.previousOpenButton ? (this.previousOpenButton.focus(), this.previousOpenButton = null) : this.contentEl.focus();
      });
    });
  }
  toggle(e, t) {
    return l(this, null, function* () {
      const s = this.getBar(e);
      return s ? s.isOpen() === !0 ? this.close() : this.open(e, t) : Promise.reject(new a(`Unknown bar '${e}'`));
    });
  }
  addPushElement(e = {}) {
    const t = new L(e);
    return this.pushableElements.push(t), t;
  }
  pushElements(e) {
    if (!e || !this.pushableElements.length)
      return this.pushableElements;
    const t = e.getPushStyles();
    for (const s of this.pushableElements)
      s.push(e, t);
    return this.pushableElements;
  }
  pullElements(e) {
    if (!e || !this.pushableElements.length)
      return this.pushableElements;
    const t = e.getPushStyles();
    for (const s of this.pushableElements)
      s.pull(t);
    return this.pushableElements;
  }
  onBarUpdate() {
    this.pushElements(this.getOpenBar());
  }
  onKeydown(e) {
    if (e.key === "Escape") {
      const t = this.getOpenBar();
      if (!t || t.permanent === !0)
        return;
      this.close();
    }
  }
  onResize() {
    this.resizeDebounce();
  }
}
export {
  C as Bartender
};
//# sourceMappingURL=Bartender.js.map
