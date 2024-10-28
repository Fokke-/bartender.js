import type { BartenderElementQuery } from './types'

/**
 * Resolve HTML element
 */
export const resolveElement = (
  query: BartenderElementQuery,
  parent: Document | HTMLElement = document,
): HTMLElement | HTMLDialogElement | null => {
  if (query instanceof Element) {
    return query as HTMLElement
  }

  if (typeof query === 'string') {
    return parent.querySelector(query) as HTMLElement
  }

  return null
}

/**
 * Sleep for given number of milliseconds
 */
export const sleep = (duration = 100): Promise<void> => {
  return new Promise((resolve) => {
    if (!duration) return resolve()

    return setTimeout(resolve, duration)
  })
}
