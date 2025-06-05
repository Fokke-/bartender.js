import { BartenderElementQuery } from './types';
export declare const parseOptions: (obj: Record<string, any>) => Record<string, any>;
/**
 * Resolve HTML element
 */
export declare const resolveElement: (query: BartenderElementQuery, parent?: Document | HTMLElement) => HTMLElement | HTMLDialogElement | null;
/**
 * Sleep for given number of milliseconds
 */
export declare const sleep: (duration?: number) => Promise<void>;
