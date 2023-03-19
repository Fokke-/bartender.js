var E = Object.defineProperty;
var m = Object.getOwnPropertySymbols;
var p = Object.prototype.hasOwnProperty, v = Object.prototype.propertyIsEnumerable;
var u = (i, e, t) => e in i ? E(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, h = (i, e) => {
  for (var t in e || (e = {}))
    p.call(e, t) && u(i, t, e[t]);
  if (m)
    for (var t of m(e))
      v.call(e, t) && u(i, t, e[t]);
  return i;
};
var r = (i, e, t) => (u(i, typeof e != "symbol" ? e + "" : e, t), t);
var f = (i, e, t) => new Promise((s, n) => {
  var o = (a) => {
    try {
      l(t.next(a));
    } catch (b) {
      n(b);
    }
  }, d = (a) => {
    try {
      l(t.throw(a));
    } catch (b) {
      n(b);
    }
  }, l = (a) => a.done ? s(a.value) : Promise.resolve(a.value).then(o, d);
  l((t = t.apply(i, e)).next());
});
const c = (i, e) => {
  if (i instanceof HTMLElement)
    return i;
  if (typeof e == "string")
    return document.querySelector(e) || void 0;
}, w = (i = 100) => new Promise((e) => i ? setTimeout(e, i) : e());
class _ {
  constructor(e, t = {}, s) {
    r(this, "bartender");
    r(this, "name");
    r(this, "el");
    r(this, "elSelector");
    r(this, "position");
    r(this, "mode");
    r(this, "isOpen", !1);
    r(this, "openTimeout");
    if (!e)
      throw "Bar name is required";
    if (!s)
      throw `You must pass Bartender instance for bar '${this.name}'`;
    if (Object.assign(this, t), this.name = e, this.bartender = s, this.el = c(this.el, this.elSelector), !this.el)
      throw `Content element for bar '${this.name}' is required`;
    if (this.el.parentElement !== this.bartender.mainEl)
      throw `Element of bar '${this.name}' must be a direct child of the Bartender main element`;
    this.el.classList.add("bartender__bar"), this.setPosition(this.position), this.setMode(this.mode);
  }
  /**
   * Set position
   *
   * @param position
   * @throws Error message
   * @returns this
   */
  setPosition(e) {
    var s, n;
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
    return this.position && ((s = this.el) == null || s.classList.remove(`bartender__bar--${this.position}`)), this.position = e, (n = this.el) == null || n.classList.add(`bartender__bar--${this.position}`), this;
  }
  /**
   * Set mode
   *
   * @param mode
   * @throws Error message
   * @returns this
   */
  setMode(e) {
    var s, n;
    if (!e)
      throw `Mode is required for bar '${this.name}'`;
    const t = [
      "float",
      "push",
      "reveal"
    ];
    if (!t.includes(e))
      throw `Invalid mode '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`;
    return this.mode && ((s = this.el) == null || s.classList.remove(`bartender__bar--${this.mode}`)), this.mode = e, (n = this.el) == null || n.classList.add(`bartender__bar--${this.mode}`), this;
  }
  open() {
    return f(this, null, function* () {
      var t, s;
      const e = (t = this.bartender) == null ? void 0 : t.getOpenBar();
      return (e == null ? void 0 : e.name) === this.name ? Promise.resolve(this) : ((s = this.bartender) == null ? void 0 : s.busy) === !0 ? Promise.resolve(this) : (this.bartender.busy = !0, e && (yield e.close(), yield w(this.openTimeout)), new Promise((n) => {
        var o, d, l;
        (o = this.el) == null || o.addEventListener("transitionend", () => {
          var a;
          return (a = this.el) == null || a.dispatchEvent(new CustomEvent("bartender-bar-after-open", {
            bubbles: !0,
            detail: {
              bar: this
            }
          })), this.bartender.busy = !1, n(this);
        }, {
          once: !0
        }), (d = this.el) == null || d.dispatchEvent(new CustomEvent("bartender-bar-before-open", {
          bubbles: !0,
          detail: {
            bar: this
          }
        })), (l = this.el) == null || l.classList.add("bartender__bar--open"), this.isOpen = !0;
      }));
    });
  }
  close() {
    return new Promise((e) => {
      var t, s, n;
      (t = this.el) == null || t.addEventListener("transitionend", () => {
        var o;
        return (o = this.el) == null || o.dispatchEvent(new CustomEvent("bartender-bar-after-close", {
          bubbles: !0,
          detail: {
            bar: this
          }
        })), e(this);
      }, {
        once: !0
      }), (s = this.el) == null || s.dispatchEvent(new CustomEvent("bartender-bar-before-close", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), (n = this.el) == null || n.classList.remove("bartender__bar--open"), this.isOpen = !1;
    });
  }
  toggle() {
    return this.isOpen === !0 ? this.close() : this.open();
  }
}
class g {
  /**
   * Constructor
   *
   * @param options Bartender options
   * @param barDefaultOptions Default options for new bars
   * @throws Error message
   */
  constructor(e = {}, t = {}) {
    // TODO: overlay should be defined per bar
    // TODO: closeOnOverlayClick should be defined per bar
    // TODO: closeOnEsc should be defined per bar
    // TODO: trapFocus should be defined per bar
    // TODO: scrollTop should be defined per bar
    r(this, "debug", !1);
    r(this, "busy", !1);
    r(this, "mainEl");
    r(this, "mainElSelector");
    r(this, "contentEl");
    r(this, "contentElSelector");
    r(this, "bars", {});
    r(this, "barDefaultOptions", {});
    if (Object.assign(this, h({
      debug: !1,
      mainEl: void 0,
      mainElSelector: ".bartender",
      contentEl: void 0,
      contentElSelector: ".bartender__content"
    }, e)), Object.assign(this.barDefaultOptions, h({
      position: "left",
      mode: "float",
      openTimeout: 100
    }, t)), this.mainEl = c(this.mainEl, this.mainElSelector), !this.mainEl)
      throw "Main element is required";
    if (this.contentEl = c(this.contentEl, this.contentElSelector), !this.contentEl)
      throw "Content element is required";
    if (this.contentEl.parentElement !== this.mainEl)
      throw "Content element must be a direct child of the main element";
    this.mainEl.classList.add("bartender--ready"), this.mainEl.dispatchEvent(new CustomEvent("bartender-init", {
      bubbles: !0,
      detail: {
        bartender: this
      }
    }));
  }
  /**
   * Add a new bar
   *
   * @param name Unique name for the bar
   * @param options Bar options
   * @throws Error message
   * @returns this
   */
  addBar(e, t = {}) {
    var s;
    if (!e || typeof e != "string")
      throw "Name is required";
    if (this.bars[e])
      throw `Bar with name '${e}' is already defined`;
    return t = Object.assign({}, h(h({}, this.barDefaultOptions), t)), this.bars[e] = new _(e, t, this), (s = this.mainEl) == null || s.dispatchEvent(new CustomEvent("bartender-bar-added", {
      bubbles: !0,
      detail: {
        bar: this.bars[e]
      }
    })), this;
  }
  /**
   * Get currently open bar
   *
   * @returns Bar object
   */
  getOpenBar() {
    const e = Object.keys(this.bars).find((t) => this.bars[t].isOpen === !0);
    return e ? this.bars[e] : null;
  }
}
export {
  g as Bartender
};
