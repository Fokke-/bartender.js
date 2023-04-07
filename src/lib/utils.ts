import type { BartenderElementQuery } from './types'

/**
 * Resolve HTML element
 *
 * @param {string|Element|null} query - Selector string or element
 * @param {object} parent - Parent element
 * @param {boolean} directChild - Match only to the direct child
 * @returns {HTMLElement|null} Resolved element
 */
export const resolveElement = (
  query: BartenderElementQuery,
  parent: Document | HTMLElement = document,
  directChild = false
): HTMLElement | null => {
  if (!query) return null
  if (query instanceof Element) return query as HTMLElement
  if (typeof query === 'string') {
    if (directChild) {
      return parent.querySelector(`:scope > ${query}`) as HTMLElement
    }

    return parent.querySelector(query) as HTMLElement
  }

  return null
}

/**
 * Sleep for given number of milliseconds
 *
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise<void>}
 */
export const sleep = (duration = 100): Promise<void> => {
  return new Promise(resolve => {
    if (!duration) return resolve()

    return setTimeout(resolve, duration)
  })
}
