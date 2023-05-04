import type { BartenderElementQuery, BartenderPushElementOptions, BartenderBarMode, BartenderPushStyles, BartenderBarPosition } from './types';
import { Bar } from './Bar';
/**
 * Bartender pushable element
 */
export declare class PushElement {
    /** @property {HTMLElement} el - Element to push */
    readonly el: HTMLElement;
    /** @property {Bar[]} bars - Matched bars */
    readonly bars: Bar[];
    /** @property {string[]} modes - Matched modes */
    readonly modes: BartenderBarMode[];
    /** @property {string[]} positions - Matched positions */
    readonly positions: BartenderBarPosition[];
    /** @property {boolean} isPushed - Is the element currently pushed? */
    private isPushed;
    /**
     * Create a new pushable element
     *
     * @param {BartenderElementQuery} el - Pushable element
     * @param {object} options - Options for pushable element
     * @throws {BartenderError}
     */
    constructor(el: BartenderElementQuery, options?: BartenderPushElementOptions);
    /**
     * Push element
     *
     * @param {Bar} bar - The bar to match against push element properties
     * @param {object} pushStyles - Push styles from the bar
     * @returns {this}
     */
    push(bar: Bar, pushStyles: BartenderPushStyles): this;
    /**
     * Pull element and return it to the original position
     *
     * @param {object} pushStyles - Push styles from the bar
     * @returns {this}
     */
    pull(pushStyles: BartenderPushStyles): this;
}
