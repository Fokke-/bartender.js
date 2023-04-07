import type { BartenderElementQuery } from './types'

/**
 * Resolve HTML element
 *
 * @param {string|Element|null} query - Selector string or element
 * @returns {HTMLElement|null} Resolved element
 */
export const resolveElement = (query: BartenderElementQuery): HTMLElement | null => {
  if (!query) return null
  if (typeof query === 'string') return document.querySelector(query) as HTMLElement
  if (query instanceof Element) return query as HTMLElement

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
