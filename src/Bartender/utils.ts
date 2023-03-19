/**
 * Resolve HTML element
 *
 * @param element HTML element
 * @param selector Selector
 * @returns Resolved element or undefined if none found
 */
export const resolveElement = (element?: Element, selector?: string): Element | undefined => {
  if (element instanceof HTMLElement) return element
  if (typeof selector === 'string') return document.querySelector(selector) || undefined

  return undefined
}

export const sleep = (duration = 100): Promise<void> => {
  return new Promise(resolve => {
    if (!duration) return resolve()

    return setTimeout(resolve, duration)
  })
}
