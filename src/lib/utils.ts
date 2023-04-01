import type { BartenderElementQuery } from './types'

/**
 * Resolve HTML element
 *
 * @param query
 * @returns Resolved element or null if none found
 */
export const resolveElement = (query: BartenderElementQuery): HTMLElement | null => {
  if (!query) return null
  if (typeof query === 'string') return document.querySelector(query) as HTMLElement
  if (query instanceof Element) return query as HTMLElement

  return null
}

export const sleep = (duration = 100): Promise<void> => {
  return new Promise(resolve => {
    if (!duration) return resolve()

    return setTimeout(resolve, duration)
  })
}
