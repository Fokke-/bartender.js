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
