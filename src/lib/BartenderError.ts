/**
 * Bartender error
 */
export class BartenderError extends Error {

  /**
   * @param {string} message - Error message
   */
  constructor(message: string) {
    super(message)
    this.name = 'Bartender error'
  }

}
