const r = (i, t) => {
  if (i instanceof HTMLElement)
    return i;
  if (typeof t == "string")
    return document.querySelector(t) || void 0;
};
class n {
  bartender;
  name;
  el;
  elSelector;
  position = "";
  constructor(t, e = {}, s) {
    if (!t)
      throw "Bar name is required";
    if (!s)
      throw `You must pass Bartender instance for bar '${this.name}'`;
    if (this.name = t, Object.assign(this, {
      position: "left",
      ...e
    }), this.bartender = s, this.el = r(this.el, this.elSelector), !this.el)
      throw `Content element for bar '${this.name}' is required`;
    if (this.el.parentElement !== this.bartender.mainEl)
      throw `Element of bar '${this.name}' must be a direct child of the Bartender main element`;
    this.el.classList.add("bartender__bar"), this.setPosition(this.position);
  }
  /**
   * Set bar position
   *
   * @param position
   * @throws Error message
   * @returns this
   */
  setPosition(t) {
    if (!t)
      throw `Position is required for bar '${this.name}'`;
    const e = [
      "left",
      "right",
      "top",
      "bottom"
    ];
    if (!e.includes(t))
      throw `Invalid position '${t}' for bar '${this.name}'. Use one of the following: ${e.join(", ")}.`;
    return this.position && this.el?.classList.remove(`bartender__bar--${this.position}`), this.position = t, this.el?.classList.add(`bartender__bar--${this.position}`), this;
  }
}
class o {
  // TODO: overlay should be defined per bar
  // TODO: closeOnOverlayClick should be defined per bar
  // TODO: closeOnEsc should be defined per bar
  // TODO: trapFocus should be defined per bar
  // TODO: scrollTop should be defined per bar
  debug = !1;
  mainEl;
  mainElSelector;
  contentEl;
  contentElSelector;
  bars = {};
  /**
   * Constructor
   *
   * @param options Bartender options
   * @throws Error message
   */
  constructor(t = {}) {
    if (Object.assign(this, {
      debug: !1,
      mainEl: void 0,
      mainElSelector: ".bartender",
      contentEl: void 0,
      contentElSelector: ".bartender__content",
      ...t
    }), this.mainEl = r(this.mainEl, this.mainElSelector), !this.mainEl)
      throw "Main element is required";
    if (this.contentEl = r(this.contentEl, this.contentElSelector), !this.contentEl)
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
   * @returns Added bar element
   */
  addBar(t, e = {}) {
    if (!t || typeof t != "string")
      throw "Name is required";
    if (this.bars[t])
      throw `Bar with name '${t}' is already defined`;
    return this.bars[t] = new n(t, e, this), this.mainEl?.dispatchEvent(new CustomEvent("bartender-bar-added", {
      bubbles: !0,
      detail: {
        bartender: this,
        bar: this.bars[t]
      }
    })), this.bars[t];
  }
}
export {
  o as Bartender
};
