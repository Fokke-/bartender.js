export class Overlay {
  private _name = ''
  private _enabled = true
  readonly el: HTMLElement

  constructor (name: string, enabled = true) {
    this.el = document.createElement('div')
    this.el.classList.add('bartender__overlay')

    this.name = name
    this.enabled = enabled
  }

  public destroy (): this {
    this.el.remove()

    return this
  }

  public get name () {
    return this._name
  }

  public set name (name: string) {
    this.el.classList.remove(`bartender__overlay--${this._name}`)
    this.el.classList.add(`bartender__overlay--${name}`)
    this._name = name
  }

  public get enabled () {
    return this._enabled
  }

  public set enabled (val: boolean) {
    if (val === true) {
      this.el.classList.remove('bartender__overlay--transparent')
    } else {
      this.el.classList.add('bartender__overlay--transparent')
    }

    this._enabled = val
  }

  public show (): this {
    this.el.classList.add('bartender__overlay--visible')

    return this
  }

  public hide (): this {
    this.el.classList.remove('bartender__overlay--visible')

    return this
  }
}
