var $ = Object.defineProperty;
var T = Object.getOwnPropertySymbols;
var L = Object.prototype.hasOwnProperty, C = Object.prototype.propertyIsEnumerable;
var y = (i, e, t) => e in i ? $(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, v = (i, e) => {
  for (var t in e || (e = {}))
    L.call(e, t) && y(i, t, e[t]);
  if (T)
    for (var t of T(e))
      C.call(e, t) && y(i, t, e[t]);
  return i;
};
var n = (i, e, t) => (y(i, typeof e != "symbol" ? e + "" : e, t), t);
var u = (i, e, t) => new Promise((s, a) => {
  var r = (l) => {
    try {
      h(t.next(l));
    } catch (m) {
      a(m);
    }
  }, o = (l) => {
    try {
      h(t.throw(l));
    } catch (m) {
      a(m);
    }
  }, h = (l) => l.done ? s(l.value) : Promise.resolve(l.value).then(r, o);
  h((t = t.apply(i, e)).next());
});
class b {
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
    const s = this.heapArray[e], a = (r, o) => (this.heapArray.length > o && this.compare(this.heapArray[o], this.heapArray[r]) < 0 && (r = o), r);
    for (; t; ) {
      const r = b.getChildrenIndexOf(e), o = r.reduce(a, r[0]), h = this.heapArray[o];
      h !== void 0 && this.compare(s, h) > 0 ? (this._moveNode(e, o), e = o) : t = !1;
    }
  }
  _sortNodeUp(e) {
    let t = e > 0;
    for (; t; ) {
      const s = b.getParentIndexOf(e);
      s >= 0 && this.compare(this.heapArray[s], this.heapArray[e]) > 0 ? (this._moveNode(e, s), e = s) : t = !1;
    }
  }
}
function A(i, e) {
  return i.prio - e.prio || i.counter - e.counter;
}
class x {
  constructor(e, t) {
    this.maxConcurrent = e || 1, this.minCycle = t || 0, this.queueRunning = /* @__PURE__ */ new Map(), this.queueWaiting = new b(A), this.lastRun = 0, this.nextTimer = null, this.counter = 0;
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
        const s = { wait: new Promise((r) => {
          t = r;
        }), signal: t }, a = { hash: e.hash, prio: e.prio, finish: s };
        if (this.queueRunning.has(e.hash))
          throw new Error("async-await-queue: duplicate hash " + e.hash);
        this.queueRunning.set(e.hash, a), this.lastRun = Date.now(), e.start.signal();
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
    return u(this, null, function* () {
      const s = t != null ? t : 0;
      let a;
      const r = new Promise((h) => {
        a = h;
      }), o = { hash: e, prio: s, start: { signal: a, wait: r }, counter: this.counter++ };
      this.queueWaiting.push(o), this.tryRun(), yield r, this.lastRun = Date.now();
    });
  }
  run(e, t) {
    const s = t != null ? t : 0, a = Symbol();
    return this.wait(a, s).then(e).finally(() => {
      this.end(a);
    });
  }
  stat() {
    return { running: this.queueRunning.size, waiting: this.queueWaiting.size(), last: this.lastRun };
  }
  flush(e) {
    return u(this, null, function* () {
      for (; this.queueRunning.size > 0 || this.queueWaiting.size() > 0; ) {
        const t = this.queueWaiting.peek();
        if (t && (yield t.start.wait), e !== void 0 && this.queueWaiting.size() < e)
          return;
        this.queueRunning.size > 0 && (yield this.queueRunning.values().next().value.finish.wait);
      }
    });
  }
}
function j(i, e, t) {
  var s, a, r;
  e === void 0 && (e = 50), t === void 0 && (t = {});
  var o = (s = t.isImmediate) != null && s, h = (a = t.callback) != null && a, l = t.maxWait, m = Date.now(), p = [];
  function P() {
    if (l !== void 0) {
      var c = Date.now() - m;
      if (c + e >= l)
        return l - c;
    }
    return e;
  }
  var _ = function() {
    var c = [].slice.call(arguments), f = this;
    return new Promise(function(E, D) {
      var B = o && r === void 0;
      if (r !== void 0 && clearTimeout(r), r = setTimeout(function() {
        if (r = void 0, m = Date.now(), !o) {
          var O = i.apply(f, c);
          h && h(O), p.forEach(function(R) {
            return (0, R.resolve)(O);
          }), p = [];
        }
      }, P()), B) {
        var q = i.apply(f, c);
        return h && h(q), E(q);
      }
      p.push({ resolve: E, reject: D });
    });
  };
  return _.cancel = function(c) {
    r !== void 0 && clearTimeout(r), p.forEach(function(f) {
      return (0, f.reject)(c);
    }), p = [];
  }, _;
}
const w = (i) => i ? typeof i == "string" ? document.querySelector(i) : i instanceof Element ? i : null : null, g = (i = 100) => new Promise((e) => i ? setTimeout(e, i) : e());
class d extends Error {
  constructor(e) {
    super(e), this.name = "Bartender error";
  }
}
class z {
  constructor(e, t = !0) {
    n(this, "_name", "");
    n(this, "_enabled", !0);
    n(this, "el");
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
class W {
  constructor(e, t = {}) {
    // TODO: when mode changes, update pushable elements
    // TODO: when position changes, update pushable elements
    n(this, "overlayObj");
    n(this, "_name", "");
    n(this, "el");
    n(this, "_position", "left");
    n(this, "_mode", "float");
    n(this, "_overlay", !0);
    n(this, "permanent", !1);
    n(this, "scrollTop", !0);
    n(this, "isOpened", !1);
    var a, r, o, h, l;
    if (!e)
      throw "Bar name is required";
    this.overlayObj = new z(e, this.overlay), this.name = e;
    const s = w(t.el || null);
    if (!s)
      throw new d(`Content element for bar '${this.name}' is required`);
    this.el = s, this.el.classList.add("bartender__bar"), this.position = (a = t.position) != null ? a : this.position, this.mode = (r = t.mode) != null ? r : this._mode, this.overlay = (o = t.overlay) != null ? o : this._overlay, this.permanent = (h = t.permanent) != null ? h : this.permanent, this.scrollTop = (l = t.scrollTop) != null ? l : this.scrollTop;
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
    return u(this, null, function* () {
      return this.el.dispatchEvent(new CustomEvent("bartender-bar-before-open", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), this.scrollTop === !0 && this.el.scrollTo(0, 0), this.el.classList.add("bartender__bar--open"), this.overlayObj.show(), this.isOpened = !0, yield g(this.getTransitionDuration()), this.el.dispatchEvent(new CustomEvent("bartender-bar-after-open", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), Promise.resolve(this);
    });
  }
  close() {
    return u(this, null, function* () {
      return this.el.dispatchEvent(new CustomEvent("bartender-bar-before-close", {
        bubbles: !0,
        detail: {
          bar: this
        }
      })), this.el.classList.remove("bartender__bar--open"), this.overlayObj.hide(), this.isOpened = !1, yield g(this.getTransitionDuration()), this.el.dispatchEvent(new CustomEvent("bartender-bar-after-close", {
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
class k {
  constructor(e = {}) {
    n(this, "el");
    n(this, "bars");
    n(this, "modes");
    n(this, "isPushed", !1);
    const t = w(e.el || null);
    if (!t)
      throw new d("Element is required for push element");
    this.el = t, this.bars = e.bars || [], this.modes = e.modes || [];
  }
  push(e, t) {
    return this.bars.length && !this.bars.includes(e) ? this : this.modes.length && !this.modes.includes(e.mode) ? this : (this.el.style.transform = t.transform, this.el.style.transitionTimingFunction = t.transitionTimingFunction, this.el.style.transitionDuration = t.transitionDuration, this.isPushed = !0, this);
  }
  pull() {
    return this.isPushed === !1 ? this : (this.el.style.transform = "translateX(0) translateY(0)", this);
  }
}
class S {
  constructor(e = {}, t = {}) {
    // TODO: add support for focus traps
    n(this, "queue");
    n(this, "resizeDebounce");
    n(this, "debug", !1);
    n(this, "el");
    n(this, "contentEl");
    n(this, "switchTimeout", 150);
    n(this, "bars", []);
    n(this, "pushableElements", []);
    n(this, "barDefaultOptions", {
      el: null,
      position: "left",
      mode: "float",
      overlay: !0,
      permanent: !1,
      scrollTop: !0
    });
    var r, o;
    this.debug = (r = e.debug) != null ? r : this.debug, this.switchTimeout = (o = e.switchTimeout) != null ? o : this.switchTimeout, this.barDefaultOptions = Object.assign(this.barDefaultOptions, t);
    const s = w(e.el || ".bartender");
    if (!s)
      throw new d("Main element is required");
    this.el = s;
    const a = w(e.contentEl || ".bartender__content");
    if (!a)
      throw new d("Content element is required");
    if (a.parentElement !== this.el)
      throw new d("Content element must be a direct child of the main element");
    this.contentEl = a, this.addPushElement({
      el: this.contentEl,
      modes: ["push", "reveal"]
    }), this.queue = new x(1), this.resizeDebounce = j(() => {
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
    var a;
    if (!e || typeof e != "string")
      throw new d("Name is required");
    if (this.getBar(e))
      throw new d(`Bar with name '${e}' is already defined`);
    const s = new W(e, v(v({}, this.barDefaultOptions), t));
    return (a = this.contentEl) == null || a.appendChild(s.overlayObj.el), s.overlayObj.el.addEventListener("click", () => {
      s.permanent !== !0 && this.close();
    }), this.bars.push(s), this.el.dispatchEvent(new CustomEvent("bartender-bar-added", {
      bubbles: !0,
      detail: {
        bar: s
      }
    })), s;
  }
  // TODO: add removeBar
  openBar(e) {
    return u(this, null, function* () {
      const t = this.getBar(e);
      return t ? t.isOpen() === !0 ? Promise.resolve(t) : (this.getOpenBar() && (yield this.closeBar(!1), yield g(this.switchTimeout)), this.el.classList.add("bartender--open"), this.pushElements(t), t.open()) : Promise.reject(new d(`Unknown bar '${e}'`));
    });
  }
  open(e) {
    return u(this, null, function* () {
      const t = Symbol();
      return yield this.queue.wait(t), this.openBar(e).finally(() => {
        this.queue.end(t);
      });
    });
  }
  closeBar(e = !0) {
    return u(this, null, function* () {
      const t = this.getOpenBar();
      return t ? (this.pullElements(), yield t.close(), e === !0 && this.el.classList.remove("bartender--open"), Promise.resolve(t)) : Promise.resolve(null);
    });
  }
  close() {
    return u(this, null, function* () {
      const e = Symbol();
      return yield this.queue.wait(e), this.closeBar().finally(() => {
        this.queue.end(e);
      });
    });
  }
  toggle(e) {
    return u(this, null, function* () {
      const t = this.getBar(e);
      return t ? t.isOpen() === !0 ? this.close() : this.open(e) : Promise.reject(new d(`Unknown bar '${e}'`));
    });
  }
  addPushElement(e = {}) {
    const t = new k(e);
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
  S as Bartender
};
