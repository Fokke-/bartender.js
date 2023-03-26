var g = Object.defineProperty;
var w = Object.getOwnPropertySymbols;
var v = Object.prototype.hasOwnProperty, E = Object.prototype.propertyIsEnumerable;
var b = (r, e, t) => e in r ? g(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, f = (r, e) => {
  for (var t in e || (e = {}))
    v.call(e, t) && b(r, t, e[t]);
  if (w)
    for (var t of w(e))
      E.call(e, t) && b(r, t, e[t]);
  return r;
};
var a = (r, e, t) => (b(r, typeof e != "symbol" ? e + "" : e, t), t);
var h = (r, e, t) => new Promise((i, s) => {
  var n = (u) => {
    try {
      l(t.next(u));
    } catch (p) {
      s(p);
    }
  }, o = (u) => {
    try {
      l(t.throw(u));
    } catch (p) {
      s(p);
    }
  }, l = (u) => u.done ? i(u.value) : Promise.resolve(u.value).then(n, o);
  l((t = t.apply(r, e)).next());
});
const d = (r, e) => {
  if (r instanceof HTMLElement)
    return r;
  if (typeof e == "string")
    return document.querySelector(e) || void 0;
}, y = (r = 100) => new Promise((e) => r ? setTimeout(e, r) : e());
class c extends Error {
  constructor(e) {
    super(e), this.name = "Bartender error";
  }
}
class _ {
  constructor(e, t = !0) {
    a(this, "_name", "");
    a(this, "_enabled", !0);
    a(this, "el");
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
    e === !0 ? this.el.classList.remove("bartender__overlay--disabled") : this.el.classList.add("bartender__overlay--disabled"), this._enabled = e;
  }
  show() {
    return this.el.classList.add("bartender__overlay--visible"), this;
  }
  hide() {
    return this.el.classList.remove("bartender__overlay--visible"), this;
  }
}
class q {
  constructor(e, t = {}) {
    // TODO: when mode changes, update pushable elements
    // TODO: when position changes, update pushable elements
    a(this, "overlayObj");
    a(this, "_name", "");
    a(this, "el");
    a(this, "_position", "left");
    a(this, "_mode", "float");
    a(this, "_overlay", !0);
    a(this, "permanent", !1);
    a(this, "isOpened", !1);
    var i, s, n, o;
    if (!e)
      throw "Bar name is required";
    if (this.overlayObj = new _(e, this.overlay), this.name = e, this.el = d(t.el, t.elSelector), !this.el)
      throw new c(`Content element for bar '${this.name}' is required`);
    this.el.classList.add("bartender__bar"), this.mode = (i = t.mode) != null ? i : this._mode, this.position = (s = t.position) != null ? s : this.position, this.overlay = (n = t.overlay) != null ? n : this._overlay, this.permanent = (o = t.permanent) != null ? o : this.permanent;
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
    var i, s;
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
    this.el && (this.el.style.transition = "none"), (i = this.el) == null || i.classList.remove(`bartender__bar--${this.position}`), (s = this.el) == null || s.classList.add(`bartender__bar--${e}`), this._position = e, setTimeout(() => {
      this.el && (this.el.style.transition = "");
    });
  }
  get mode() {
    return this._mode;
  }
  set mode(e) {
    var i, s;
    if (!e)
      throw `Mode is required for bar '${this.name}'`;
    const t = [
      "float",
      "push",
      "reveal"
    ];
    if (!t.includes(e))
      throw `Invalid mode '${e}' for bar '${this.name}'. Use one of the following: ${t.join(", ")}.`;
    (i = this.el) == null || i.classList.remove(`bartender__bar--${this.mode}`), (s = this.el) == null || s.classList.add(`bartender__bar--${e}`), this._mode = e;
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
  isPushing() {
    return ["push", "reveal"].includes(this.mode);
  }
  getTransitionDuration() {
    if (!this.el)
      return 0;
    const e = window.getComputedStyle(this.el).getPropertyValue("transition-duration") || "0s";
    return parseFloat(e) * 1e3;
  }
  open() {
    return h(this, null, function* () {
      var e, t, i;
      return (e = this.el) == null || e.dispatchEvent(new CustomEvent("bartender-bar-before-open", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), (t = this.el) == null || t.classList.add("bartender__bar--open"), this.isOpened = !0, yield y(this.getTransitionDuration()), (i = this.el) == null || i.dispatchEvent(new CustomEvent("bartender-bar-after-open", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), Promise.resolve(this);
    });
  }
  close() {
    return h(this, null, function* () {
      var e, t, i;
      return (e = this.el) == null || e.dispatchEvent(new CustomEvent("bartender-bar-before-close", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), (t = this.el) == null || t.classList.remove("bartender__bar--open"), this.isOpened = !1, yield y(this.getTransitionDuration()), (i = this.el) == null || i.dispatchEvent(new CustomEvent("bartender-bar-after-close", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), Promise.resolve(this);
    });
  }
  getPushStyles() {
    return !this.position || !this.el ? null : {
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
class m {
  constructor(e) {
    this.compare = e, this.heapArray = [], this._limit = 0;
  }
  static getChildrenIndexOf(e) {
    return [2 * e + 1, 2 * e + 2];
  }
  static getParentIndexOf(e) {
    if (e <= 0)
      return -1;
    const t = e % 2 ? 1 : 2;
    return Math.floor((e - t) / 2);
  }
  push(e) {
    return this._sortNodeUp(this.heapArray.push(e) - 1), !0;
  }
  length() {
    return this.heapArray.length;
  }
  peek() {
    return this.heapArray[0];
  }
  pop() {
    const e = this.heapArray.pop();
    return this.length() > 0 && e !== void 0 ? this.replace(e) : e;
  }
  replace(e) {
    const t = this.heapArray[0];
    return this.heapArray[0] = e, this._sortNodeDown(0), t;
  }
  size() {
    return this.length();
  }
  _moveNode(e, t) {
    [this.heapArray[e], this.heapArray[t]] = [this.heapArray[t], this.heapArray[e]];
  }
  _sortNodeDown(e) {
    let t = e < this.heapArray.length - 1;
    const i = this.heapArray[e], s = (n, o) => (this.heapArray.length > o && this.compare(this.heapArray[o], this.heapArray[n]) < 0 && (n = o), n);
    for (; t; ) {
      const n = m.getChildrenIndexOf(e), o = n.reduce(s, n[0]), l = this.heapArray[o];
      l !== void 0 && this.compare(i, l) > 0 ? (this._moveNode(e, o), e = o) : t = !1;
    }
  }
  _sortNodeUp(e) {
    let t = e > 0;
    for (; t; ) {
      const i = m.getParentIndexOf(e);
      i >= 0 && this.compare(this.heapArray[i], this.heapArray[e]) > 0 ? (this._moveNode(e, i), e = i) : t = !1;
    }
  }
}
function P(r, e) {
  return r.prio - e.prio || r.counter - e.counter;
}
class O {
  constructor(e, t) {
    this.maxConcurrent = e || 1, this.minCycle = t || 0, this.queueRunning = /* @__PURE__ */ new Map(), this.queueWaiting = new m(P), this.lastRun = 0, this.nextTimer = null, this.counter = 0;
  }
  tryRun() {
    for (; this.queueWaiting.size() > 0 && this.queueRunning.size < this.maxConcurrent; ) {
      if (Date.now() - this.lastRun < this.minCycle)
        return void (this.nextTimer === null && (this.nextTimer = new Promise((t) => setTimeout(() => {
          this.nextTimer = null, this.tryRun(), t();
        }, this.minCycle - Date.now() + this.lastRun))));
      const e = this.queueWaiting.pop();
      if (e !== void 0) {
        let t;
        const i = { wait: new Promise((n) => {
          t = n;
        }), signal: t }, s = { hash: e.hash, prio: e.prio, finish: i };
        if (this.queueRunning.has(e.hash))
          throw new Error("async-await-queue: duplicate hash " + e.hash);
        this.queueRunning.set(e.hash, s), this.lastRun = Date.now(), e.start.signal();
      }
    }
  }
  end(e) {
    const t = this.queueRunning.get(e);
    if (t === void 0)
      throw new Error("async-await-queue: queue desync for " + e);
    this.queueRunning.delete(e), t.finish.signal(), this.tryRun();
  }
  wait(e, t) {
    return h(this, null, function* () {
      const i = t != null ? t : 0;
      let s;
      const n = new Promise((l) => {
        s = l;
      }), o = { hash: e, prio: i, start: { signal: s, wait: n }, counter: this.counter++ };
      this.queueWaiting.push(o), this.tryRun(), yield n, this.lastRun = Date.now();
    });
  }
  run(e, t) {
    const i = t != null ? t : 0, s = Symbol();
    return this.wait(s, i).then(e).finally(() => {
      this.end(s);
    });
  }
  stat() {
    return { running: this.queueRunning.size, waiting: this.queueWaiting.size(), last: this.lastRun };
  }
  flush(e) {
    return h(this, null, function* () {
      for (; this.queueRunning.size > 0 || this.queueWaiting.size() > 0; ) {
        const t = this.queueWaiting.peek();
        if (t && (yield t.start.wait), e !== void 0 && this.queueWaiting.size() < e)
          return;
        this.queueRunning.size > 0 && (yield this.queueRunning.values().next().value.finish.wait);
      }
    });
  }
}
class B {
  constructor(e = {}, t = {}) {
    // TODO: refresh pushable elements when resizing
    // TODO: overlay should be defined per bar
    // TODO: trapFocus should be defined per bar
    // TODO: scrollTop should be defined per bar
    // TODO: create custom error class with 'Bartender:' prefix
    a(this, "queue");
    a(this, "debug", !1);
    a(this, "mainEl");
    a(this, "mainElSelector", ".bartender");
    a(this, "contentEl");
    a(this, "contentElSelector", ".bartender__content");
    a(this, "switchTimeout", 150);
    a(this, "bars", []);
    a(this, "pushableElements", []);
    a(this, "barOptions", {
      position: "left",
      mode: "float",
      permanent: !1
    });
    var i, s, n, o;
    if (this.debug = (i = e.debug) != null ? i : this.debug, this.mainElSelector = (s = e.mainElSelector) != null ? s : this.mainElSelector, this.contentElSelector = (n = e.contentElSelector) != null ? n : this.contentElSelector, this.switchTimeout = (o = e.switchTimeout) != null ? o : this.switchTimeout, this.barOptions = Object.assign(this.barOptions, t), this.mainEl = d(e.mainEl, this.mainElSelector), !this.mainEl)
      throw new c("Main element is required");
    if (this.contentEl = d(e.contentEl, this.contentElSelector), !this.contentEl)
      throw new c("Content element is required");
    if (this.addPushElement({
      el: this.contentEl
    }), this.contentEl.parentElement !== this.mainEl)
      throw new c("Content element must be a direct child of the main element");
    this.queue = new O(1), window.addEventListener("keydown", this.handleKeydown.bind(this)), this.mainEl.classList.add("bartender--ready"), this.mainEl.dispatchEvent(new CustomEvent("bartender-init", {
      bubbles: !0,
      detail: {
        bartender: this
      }
    }));
  }
  // TODO: finish this
  destroy() {
    var e;
    (e = this.mainEl) == null || e.classList.remove("bartender--ready");
  }
  getBar(e) {
    return this.bars.find((t) => t.name === e) || null;
  }
  getOpenBar() {
    return this.bars.find((e) => e.isOpen() === !0) || null;
  }
  addBar(e, t = {}) {
    var n, o;
    if (!e || typeof e != "string")
      return Promise.reject(new Error("Name is required"));
    if (this.getBar(e))
      return Promise.reject(new Error(`Bar with name '${e}' is already defined`));
    const i = f(f({}, this.barOptions), t), s = new q(e, i);
    return (n = this.contentEl) == null || n.appendChild(s.overlayObj.el), s.overlayObj.el.addEventListener("click", () => {
      s.permanent !== !0 && this.close();
    }), this.bars.push(s), (o = this.mainEl) == null || o.dispatchEvent(new CustomEvent("bartender-bar-added", {
      bubbles: !0,
      detail: {
        bar: s
      }
    })), Promise.resolve(s);
  }
  // TODO: add removeBar
  openBar(e) {
    return h(this, null, function* () {
      var i;
      const t = this.getBar(e);
      return t ? t.isOpen() === !0 ? Promise.resolve(t) : (this.getOpenBar() && (yield this.closeBar(!1), yield y(this.switchTimeout)), (i = this.mainEl) == null || i.classList.add("bartender--open"), t.overlayObj.show(), t.isPushing() === !0 && (yield this.pushElements(t.getPushStyles())), t.open()) : Promise.reject(new Error(`Unknown bar '${e}'`));
    });
  }
  open(e) {
    return h(this, null, function* () {
      const t = Symbol();
      return yield this.queue.wait(t), this.openBar(e).finally(() => {
        this.queue.end(t);
      });
    });
  }
  closeBar(e = !0) {
    return h(this, null, function* () {
      var i;
      const t = this.getOpenBar();
      return t ? (this.pullElements(), t.overlayObj.hide(), yield t.close(), e === !0 && ((i = this.mainEl) == null || i.classList.remove("bartender--open")), Promise.resolve(t)) : Promise.resolve(null);
    });
  }
  close() {
    return h(this, null, function* () {
      const e = Symbol();
      return yield this.queue.wait(e), this.closeBar().finally(() => {
        this.queue.end(e);
      });
    });
  }
  toggle(e) {
    return h(this, null, function* () {
      const t = this.getBar(e);
      return t ? t.isOpen() === !0 ? this.close() : this.open(e) : Promise.reject(new Error(`Unknown bar '${e}'`));
    });
  }
  // TODO: support push elements per bar
  addPushElement(e = {}) {
    const t = d(e.el, e.elSelector);
    return t ? (this.pushableElements.push(t), Promise.resolve(t)) : Promise.reject(new Error("Unknown push element"));
  }
  pushElements(e) {
    return new Promise((t) => {
      if (!e || !this.pushableElements.length)
        return t(this.pushableElements);
      for (const i of this.pushableElements)
        i.style.transform = e.transform, i.style.transitionDuration = e.transitionDuration, i.style.transitionTimingFunction = e.transitionTimingFunction;
      return t(this.pushableElements);
    });
  }
  pullElements() {
    return new Promise((e) => {
      if (!this.pushableElements.length)
        return Promise.resolve(this.pushableElements);
      for (const t of this.pushableElements)
        t.style.transform = "translateX(0) translateY(0)";
      return e(this.pushableElements);
    });
  }
  handleKeydown(e) {
    if (e.key === "Escape") {
      const t = this.getOpenBar();
      if (!t || t.permanent === !0)
        return;
      this.close();
    }
  }
}
export {
  B as Bartender
};
