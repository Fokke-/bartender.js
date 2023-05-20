import type { BartenderElementQuery } from './types';
/**
 * Resolve HTML element
 *
 * @param {string|Element|null} query - Selector string or element
 * @param {object} parent - Parent element
 * @param {boolean} directChild - Match only to the direct child
 * @returns {HTMLElement|null} Resolved element
 */
export declare const resolveElement: (query: BartenderElementQuery, parent?: Document | HTMLElement, directChild?: boolean) => HTMLElement | null;
/**
 * Sleep for given number of milliseconds
 *
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise<void>}
 */
export declare const sleep: (duration?: number) => Promise<void>;
/**
 * Set dvh unit
 *
 * @returns {void}
 */
export declare const setDvh: () => number | null;
