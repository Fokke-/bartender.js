var v = Object.defineProperty;
var w = Object.getOwnPropertySymbols;
var y = Object.prototype.hasOwnProperty, _ = Object.prototype.propertyIsEnumerable;
var m = (i, e, t) => e in i ? v(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, f = (i, e) => {
  for (var t in e || (e = {}))
    y.call(e, t) && m(i, t, e[t]);
  if (w)
    for (var t of w(e))
      _.call(e, t) && m(i, t, e[t]);
  return i;
};
var s = (i, e, t) => (m(i, typeof e != "symbol" ? e + "" : e, t), t);
var o = (i, e, t) => new Promise((r, n) => {
  var h = (a) => {
    try {
      d(t.next(a));
    } catch (c) {
      n(c);
    }
  }, u = (a) => {
    try {
      d(t.throw(a));
    } catch (c) {
      n(c);
    }
  }, d = (a) => a.done ? r(a.value) : Promise.resolve(a.value).then(h, u);
  d((t = t.apply(i, e)).next());
});
import { Queue as g } from "async-await-queue";
import { debounce as E } from "ts-debounce";
const b = (i) => i ? typeof i == "string" ? document.querySelector(i) : i instanceof Element ? i : null : null, p = (i = 100) => new Promise((e) => i ? setTimeout(e, i) : e());
class l extends Error {
  constructor(e) {
    super(e), this.name = "Bartender error";
  }
}
class O {
  constructor(e, t = !0) {
    s(this, "_name", "");
    s(this, "_enabled", !0);
    s(this, "el");
    this.el = document.createElement("div"), this.el.classList.add("bartender__overlay"), this.name = e, this.enabled = t;
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
class B {
  constructor(e, t = {}) {
    // TODO: when mode changes, update pushable elements
    // TODO: when position changes, update pushable elements
    s(this, "overlayObj");
    s(this, "_name", "");
    s(this, "el");
    s(this, "_position", "left");
    s(this, "_mode", "float");
    s(this, "_overlay", !0);
    s(this, "permanent", !1);
    s(this, "scrollTop", !0);
    s(this, "isOpened", !1);
    var n, h, u, d, a;
    if (!e)
      throw "Bar name is required";
    this.overlayObj = new O(e, this.overlay), this.name = e;
    const r = b(t.el || null);
    if (!r)
      throw new l(`Content element for bar '${this.name}' is required`);
    this.el = r, this.el.classList.add("bartender__bar"), this.position = (n = t.position) != null ? n : this.position, this.mode = (h = t.mode) != null ? h : this._mode, this.overlay = (u = t.overlay) != null ? u : this._overlay, this.permanent = (d = t.permanent) != null ? d : this.permanent, this.scrollTop = (a = t.scrollTop) != null ? a : this.scrollTop;
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
    this.el && (this.el.style.transition = "none"), this.el.classList.remove(`bartender__bar--${this.position}`), this.el.classList.add(`bartender__bar--${e}`), this._position = e, setTimeout(() => {
      this.el && (this.el.style.transition = "");
    });
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
    this.el.classList.remove(`bartender__bar--${this.mode}`), this.el.classList.add(`bartender__bar--${e}`), this._mode = e;
  }
  get overlay() {
    return this._overlay;
  }
  set overlay(e) {
    this.overlayObj.enabled = e, this._overlay = e;
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
    return o(this, null, function* () {
      return this.el.dispatchEvent(new CustomEvent("bartender-bar-before-open", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), this.scrollTop === !0 && this.el.scrollTo(0, 0), this.el.classList.add("bartender__bar--open"), this.overlayObj.show(), this.isOpened = !0, yield p(this.getTransitionDuration()), this.el.dispatchEvent(new CustomEvent("bartender-bar-after-open", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), Promise.resolve(this);
    });
  }
  close() {
    return o(this, null, function* () {
      return this.el.dispatchEvent(new CustomEvent("bartender-bar-before-close", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), this.el.classList.remove("bartender__bar--open"), this.overlayObj.hide(), this.isOpened = !1, yield p(this.getTransitionDuration()), this.el.dispatchEvent(new CustomEvent("bartender-bar-after-close", {
        bubbles: !0,
        detail: {
          bar: this
        }
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
class $ {
  constructor(e = {}) {
    s(this, "el");
    s(this, "bars");
    s(this, "modes");
    s(this, "isPushed", !1);
    const t = b(e.el || null);
    if (!t)
      throw new l("Element is required for push element");
    this.el = t, this.bars = e.bars || [], this.modes = e.modes || [];
  }
  push(e, t) {
    return this.bars.length && !this.bars.includes(e) ? this : this.modes.length && !this.modes.includes(e.mode) ? this : (this.el.style.transform = t.transform, this.el.style.transitionTimingFunction = t.transitionTimingFunction, this.el.style.transitionDuration = t.transitionDuration, this.isPushed = !0, this);
  }
  pull() {
    return this.isPushed === !1 ? this : (this.el.style.transform = "translateX(0) translateY(0)", this);
  }
}
class D {
  constructor(e = {}, t = {}) {
    // TODO: add support for focus traps
    s(this, "queue");
    s(this, "resizeDebounce");
    s(this, "debug", !1);
    s(this, "el");
    s(this, "contentEl");
    s(this, "switchTimeout", 150);
    s(this, "bars", []);
    s(this, "pushableElements", []);
    s(this, "barDefaultOptions", {
      el: null,
      position: "left",
      mode: "float",
      overlay: !0,
      permanent: !1,
      scrollTop: !0
    });
    var h, u;
    this.debug = (h = e.debug) != null ? h : this.debug, this.switchTimeout = (u = e.switchTimeout) != null ? u : this.switchTimeout, this.barDefaultOptions = Object.assign(this.barDefaultOptions, t);
    const r = b(e.el || ".bartender");
    if (!r)
      throw new l("Main element is required");
    this.el = r;
    const n = b(e.contentEl || ".bartender__content");
    if (!n)
      throw new l("Content element is required");
    if (n.parentElement !== this.el)
      throw new l("Content element must be a direct child of the main element");
    this.contentEl = n, this.addPushElement({
      el: this.contentEl,
      modes: ["push", "reveal"]
    }), this.queue = new g(1), this.resizeDebounce = E(() => {
      this.pushElements(this.getOpenBar());
    }, 100), window.addEventListener("keydown", this.onKeydown.bind(this)), window.addEventListener("resize", this.onResize.bind(this)), this.el.classList.add("bartender--ready"), this.el.dispatchEvent(new CustomEvent("bartender-init", {
      bubbles: !0,
      detail: {
        bartender: this
      }
    }));
  }
  // TODO: Finish this
  // TODO: Tear down event listeners
  destroy() {
    this.el.classList.remove("bartender--ready");
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
      throw new l("Name is required");
    if (this.getBar(e))
      throw new l(`Bar with name '${e}' is already defined`);
    const r = new B(e, f(f({}, this.barDefaultOptions), t));
    return (n = this.contentEl) == null || n.appendChild(r.overlayObj.el), r.overlayObj.el.addEventListener("click", () => {
      r.permanent !== !0 && this.close();
    }), this.bars.push(r), this.el.dispatchEvent(new CustomEvent("bartender-bar-added", {
      bubbles: !0,
      detail: {
        bar: r
      }
    })), r;
  }
  // TODO: add removeBar
  openBar(e) {
    return o(this, null, function* () {
      const t = this.getBar(e);
      return t ? t.isOpen() === !0 ? Promise.resolve(t) : (this.getOpenBar() && (yield this.closeBar(!1), yield p(this.switchTimeout)), this.el.classList.add("bartender--open"), this.pushElements(t), t.open()) : Promise.reject(new l(`Unknown bar '${e}'`));
    });
  }
  open(e) {
    return o(this, null, function* () {
      const t = Symbol();
      return yield this.queue.wait(t), this.openBar(e).finally(() => {
        this.queue.end(t);
      });
    });
  }
  closeBar(e = !0) {
    return o(this, null, function* () {
      const t = this.getOpenBar();
      return t ? (this.pullElements(), yield t.close(), e === !0 && this.el.classList.remove("bartender--open"), Promise.resolve(t)) : Promise.resolve(null);
    });
  }
  close() {
    return o(this, null, function* () {
      const e = Symbol();
      return yield this.queue.wait(e), this.closeBar().finally(() => {
        this.queue.end(e);
      });
    });
  }
  toggle(e) {
    return o(this, null, function* () {
      const t = this.getBar(e);
      return t ? t.isOpen() === !0 ? this.close() : this.open(e) : Promise.reject(new l(`Unknown bar '${e}'`));
    });
  }
  addPushElement(e = {}) {
    const t = new $(e);
    return this.pushableElements.push(t), t;
  }
  pushElements(e) {
    if (!e || !this.pushableElements.length)
      return this.pushableElements;
    const t = e.getPushStyles();
    for (const r of this.pushableElements)
      r.push(e, t);
    return this.pushableElements;
  }
  pullElements() {
    this.pushableElements.length || this.pushableElements;
    for (const e of this.pushableElements)
      e.pull();
    return this.pushableElements;
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
  D as Bartender
};
