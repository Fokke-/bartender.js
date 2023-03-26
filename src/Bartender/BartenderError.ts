export class BartenderError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'Bartender error'
  }
}
