class t {
  // Debug mode
  debug = !1;
  constructor(s = {}) {
    Object.assign(this, s), console.log(this.debug);
  }
}
export {
  t as Bartender
};
