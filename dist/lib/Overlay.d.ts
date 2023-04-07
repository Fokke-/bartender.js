/**
 * Bartender overlay
 */
export declare class Overlay {
    /** @property {boolean} _name - Overlay object name */
    private _name;
    /** @property {boolean} _enabled - Enable overlay? */
    private _enabled;
    /** @property {HTMLElement} el - Overlay element */
    readonly el: HTMLElement;
    /**
     * Create a new overlay
     *
     * @param {string} name - Overlay object name
     * @param {boolean} enabled - Enable overlay?
     */
    constructor(name: string, enabled?: boolean);
    /**
     * Destroy overlay instance
     *
     * @returns {this}
     */
    destroy(): this;
    /** @type {string} */
    get name(): string;
    /** @type {string} */
    set name(name: string);
    /** @type {boolean} */
    get enabled(): boolean;
    /** @type {boolean} */
    set enabled(val: boolean);
    /**
     * Show overlay
     *
     * @returns {this}
     */
    show(): this;
    /**
     * Hide overlay
     *
     * @returns {this}
     */
    hide(): this;
}
