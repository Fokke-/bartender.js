import type { BartenderElementQuery } from './types';
/**
 * Resolve HTML element
 *
 * @param query
 * @returns Resolved element or null if none found
 */
export declare const resolveElement: (query: BartenderElementQuery) => HTMLElement | null;
export declare const sleep: (duration?: number) => Promise<void>;
