var E = Object.defineProperty;
var f = Object.getOwnPropertySymbols;
var w = Object.prototype.hasOwnProperty, g = Object.prototype.propertyIsEnumerable;
var b = (r, e, t) => e in r ? E(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, a = (r, e) => {
  for (var t in e || (e = {}))
    w.call(e, t) && b(r, t, e[t]);
  if (f)
    for (var t of f(e))
      g.call(e, t) && b(r, t, e[t]);
  return r;
};
var n = (r, e, t) => (b(r, typeof e != "symbol" ? e + "" : e, t), t);
var l = (r, e, t) => new Promise((s, i) => {
  var h = (o) => {
    try {
      d(t.next(o));
    } catch (c) {
      i(c);
    }
  }, p = (o) => {
    try {
      d(t.throw(o));
    } catch (c) {
      i(c);
    }
  }, d = (o) => o.done ? s(o.value) : Promise.resolve(o.value).then(h, p);
  d((t = t.apply(r, e)).next());
});
const u = (r, e) => {
  if (r instanceof HTMLElement)
    return r;
  if (typeof e == "string")
    return document.querySelector(e) || void 0;
}, m = (r = 100) => new Promise((e) => r ? setTimeout(e, r) : e());
class v {
  constructor(e, t = {}) {
    n(this, "name");
    n(this, "el");
    n(this, "elSelector");
    n(this, "position");
    n(this, "mode");
    n(this, "isPushing", !1);
    n(this, "permanent", !1);
    n(this, "isOpen", !1);
    if (!e)
      throw "Bar name is required";
    if (Object.assign(this, t), this.name = e, this.el = u(this.el, this.elSelector), !this.el)
      throw `Content element for bar '${this.name}' is required`;
    this.el.style.transition = "none", this.el.classList.add("bartender__bar"), this.setPosition(this.position), this.setMode(this.mode), setTimeout(() => {
      this.el && (this.el.style.transition = "");
    });
  }
  getTransitionDuration() {
    if (!this.el)
      return 0;
    const e = window.getComputedStyle(this.el).getPropertyValue("transition-duration") || "0s";
    return parseFloat(e) * 1e3;
  }
  // TODO: fix this. Matrix values are incorrect when closing
  // private hasTransition () : boolean {
  //   if (
  //     !this.el ||
  //     !window.getComputedStyle(this.el).getPropertyValue('transition-duration') ||
  //     window.getComputedStyle(this.el).getPropertyValue('transition-duration') == '0s' ||
  //     !window.getComputedStyle(this.el).getPropertyValue('transition-timing-function')
  //   ) return false
  //   const matrix = window.getComputedStyle(this.el).getPropertyValue('transform')
  //   if (!matrix) return false
  //   const parsedMatrix = matrix.match(/matrix.*\((.+)\)/)
  //   if (!parsedMatrix || !parsedMatrix.length) return false
  //   const matrixValues = parsedMatrix[1].split(', ')
  //   if (!matrixValues.length) return false
  //   console.log(matrixValues)
  //   if (matrixValues[4] === '0' && matrixValues[5] === '0') return false
  //   return true
  // }
  /**
   * Set position
   *
   * @param position
   * @throws Error message
   * @returns this
   */
  setPosition(e) {
    var s, i;
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
    return this.position && ((s = this.el) == null || s.classList.remove(`bartender__bar--${this.position}`)), this.position = e, (i = this.el) == null || i.classList.add(`bartender__bar--${this.position}`), this;
  }
  /**
   * Set mode
   *
   * @param mode
   * @throws Error message
   * @returns this
   */
  setMode(e) {
    var s, i;
    if (!e)
      throw `Mode is required for bar '${this.name}'`;
    const t = [
      "float",
      "push",
      "reveal"
    ];
    if (!t.includes(e))
      throw `Invalid mode '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`;
    return this.isPushing = ["push", "reveal"].includes(e), console.log(this.isPushing), this.mode && ((s = this.el) == null || s.classList.remove(`bartender__bar--${this.mode}`)), this.mode = e, (i = this.el) == null || i.classList.add(`bartender__bar--${this.mode}`), this;
  }
  open() {
    return l(this, null, function* () {
      var e, t, s;
      return (e = this.el) == null || e.dispatchEvent(new CustomEvent("bartender-bar-before-open", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), (t = this.el) == null || t.classList.add("bartender__bar--open"), this.isOpen = !0, yield m(this.getTransitionDuration()), (s = this.el) == null || s.dispatchEvent(new CustomEvent("bartender-bar-after-open", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), Promise.resolve(this);
    });
  }
  close() {
    return l(this, null, function* () {
      var e, t, s;
      return (e = this.el) == null || e.dispatchEvent(new CustomEvent("bartender-bar-before-close", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), (t = this.el) == null || t.classList.remove("bartender__bar--open"), this.isOpen = !1, yield m(this.getTransitionDuration()), (s = this.el) == null || s.dispatchEvent(new CustomEvent("bartender-bar-after-close", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), Promise.resolve(this);
    });
  }
  getPushStyles() {
    return !this.position || !this.el ? null : {
      transform: (() => {
        var e, t, s, i;
        switch (this.position) {
          case "left":
            return `translateX(${(e = this.el) == null ? void 0 : e.offsetWidth}px)`;
          case "right":
            return `translateX(-${(t = this.el) == null ? void 0 : t.offsetWidth}px)`;
          case "top":
            return `translateY(${(s = this.el) == null ? void 0 : s.offsetHeight}px)`;
          case "bottom":
            return `translateY(-${(i = this.el) == null ? void 0 : i.offsetHeight}px)`;
          default:
            return "";
        }
      })(),
      transitionDuration: window.getComputedStyle(this.el).getPropertyValue("transition-duration") || "",
      transitionTimingFunction: window.getComputedStyle(this.el).getPropertyValue("transition-timing-function") || ""
    };
  }
}
class P {
  /**
   * Constructor
   *
   * @param userOptions Bartender options
   * @param barOptions Default options for new bars
   * @throws Error message
   */
  constructor(e = {}, t = {}) {
    // TODO: overlay should be defined per bar
    // TODO: closeOnOverlayClick should be defined per bar
    // TODO: closeOnEsc should be defined per bar
    // TODO: trapFocus should be defined per bar
    // TODO: scrollTop should be defined per bar
    n(this, "debug", !1);
    n(this, "busy", !1);
    n(this, "mainEl");
    n(this, "mainElSelector");
    n(this, "contentEl");
    n(this, "contentElSelector");
    n(this, "switchTimeout");
    n(this, "bars", []);
    n(this, "pushableElements", []);
    n(this, "barOptions", {});
    Object.assign(this, a(a({}, {
      debug: !1,
      mainEl: void 0,
      mainElSelector: ".bartender",
      contentEl: void 0,
      contentElSelector: ".bartender__content",
      switchTimeout: 100
    }), e));
    const i = {
      position: "left",
      mode: "float",
      permanent: !1
    };
    if (this.barOptions = a(a({}, i), t), this.mainEl = u(this.mainEl, this.mainElSelector), !this.mainEl)
      throw "Main element is required";
    if (this.contentEl = u(this.contentEl, this.contentElSelector), !this.contentEl)
      throw "Content element is required";
    if (this.addPushElement({
      el: this.contentEl
    }), this.contentEl.parentElement !== this.mainEl)
      throw "Content element must be a direct child of the main element";
    window.addEventListener("keydown", this.handleKeydown.bind(this)), this.mainEl.classList.add("bartender--ready"), this.mainEl.dispatchEvent(new CustomEvent("bartender-init", {
      bubbles: !0,
      detail: {
        bartender: this
      }
    }));
  }
  // TODO: make sure this is updated
  destroy() {
    var e;
    (e = this.mainEl) == null || e.classList.remove("bartender--ready");
  }
  getBar(e) {
    return this.bars.find((t) => t.name === e) || null;
  }
  /**
   * Get currently open bar
   *
   * @returns Bar object
   */
  getOpenBar() {
    return this.bars.find((e) => e.isOpen === !0) || null;
  }
  /**
   * Add a new bar
   *
   * @param name Unique name for the bar
   * @param userOptions Bar options
   * @throws Error message
   * @returns this
   */
  addBar(e, t = {}) {
    var h;
    if (!e || typeof e != "string")
      return Promise.reject(new Error("Name is required"));
    if (this.getBar(e))
      return Promise.reject(new Error(`Bar with name '${e}' is already defined`));
    const s = a(a({}, this.barOptions), t), i = new v(e, s);
    return this.bars.push(i), (h = this.mainEl) == null || h.dispatchEvent(new CustomEvent("bartender-bar-added", {
      bubbles: !0,
      detail: {
        bar: i
      }
    })), Promise.resolve(i);
  }
  open(e) {
    return l(this, null, function* () {
      var i;
      const t = this.getBar(e);
      return t ? t.isOpen === !0 ? Promise.reject(new Error(`Bar '${t.name}' is already open`)) : this.busy === !0 ? Promise.reject(new Error("Bartender is busy")) : (this.busy = !0, this.getOpenBar() && (yield this.close(), yield m(this.switchTimeout)), (i = this.mainEl) == null || i.classList.add("bartender--open"), t.isPushing === !0 && this.pushElements(t.getPushStyles()), yield t.open(), this.busy = !1, Promise.resolve(t)) : Promise.reject(new Error(`Unknown bar '${e}'`));
    });
  }
  close() {
    return l(this, null, function* () {
      var t;
      const e = this.getOpenBar();
      return e ? (this.pullElements(), yield e.close(), (t = this.mainEl) == null || t.classList.remove("bartender--open"), Promise.resolve(e)) : Promise.resolve(null);
    });
  }
  toggle(e) {
    return l(this, null, function* () {
      const t = this.getBar(e);
      return t ? t.isOpen === !0 ? this.close() : this.open(e) : Promise.reject(new Error(`Unknown bar '${e}'`));
    });
  }
  // TODO: support push elements per bar
  addPushElement(e = {}) {
    const t = u(e.el, e.elSelector);
    return t ? (this.pushableElements.push(t), Promise.resolve(t)) : Promise.reject(new Error("Unknown push element"));
  }
  pushElements(e) {
    if (!e || !this.pushableElements.length)
      return null;
    for (const t of this.pushableElements)
      t.style.transform = e.transform, t.style.transitionDuration = e.transitionDuration, t.style.transitionTimingFunction = e.transitionTimingFunction;
    return this.pushableElements;
  }
  pullElements() {
    if (!this.pushableElements.length)
      return null;
    for (const e of this.pushableElements)
      e.style.transform = "translateX(0) translateY(0)";
    return this.pushableElements;
  }
  handleKeydown(e) {
    e.key === "Escape" && this.close();
  }
}
export {
  P as Bartender
};
