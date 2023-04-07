import type { BartenderBarOptions, BartenderBarPosition, BartenderBarMode, BartenderPushStyles } from './types';
import { Overlay } from './Overlay';
/**
 * Bartender bar
 */
export declare class Bar {
    /** @property {boolean} debug - Enable debug mode? */
    debug: boolean;
    /** @property {boolean} initialized - Is bar initialized? */
    private initialized;
    /** @property {Overlay} overlayObj - Overlay object for the bar */
    readonly overlayObj: Overlay;
    /** @property {string} _name - Bar name */
    private _name;
    /** @property {HTMLElement} el - Bar element */
    readonly el: HTMLElement;
    /** @property {string} _position - Bar position */
    private _position;
    /** @property {string} _mode - Bar mode */
    private _mode;
    /** @property {boolean} _overlay - Enable overlay? */
    private _overlay;
    /** @property {boolean} _permanent - Enable permanent mode? */
    private _permanent;
    /** @property {boolean} _scrollTop - Scroll to the top when bar is opened? */
    private _scrollTop;
    /** @property {boolean} focusTrap - Enable focus trap? */
    private focusTrap;
    /** @property {boolean} isOpened - Is the bar currently open? */
    private isOpened;
    /** @property {object|null} trap - Focus trap */
    private trap;
    /**
     * Create a new bar
     *
     * @param {string} name - Unique name of the bar
     * @param {object} options - Bar options
     * @throws {BartenderError}
     */
    constructor(name: string, options?: BartenderBarOptions);
    /**
     * Destroy bar instance
     *
     * @returns {this}
     */
    destroy(): this;
    /** @type {string} */
    get name(): string;
    /** @type {string} */
    set name(name: string);
    /** @type {string} */
    get position(): BartenderBarPosition;
    /**
     * @type {string}
     * @throws {BartenderError}
     */
    set position(position: BartenderBarPosition);
    /** @type {string} */
    get mode(): BartenderBarMode;
    /**
     * @type {string}
     * @throws {BartenderError}
     */
    set mode(mode: BartenderBarMode);
    /** @type {boolean} */
    get overlay(): boolean;
    /** @type {boolean} */
    set overlay(val: boolean);
    /** @type {boolean} */
    get permanent(): boolean;
    /** @type {boolean} */
    set permanent(val: boolean);
    /** @type {boolean} */
    get scrollTop(): boolean;
    /** @type {boolean} */
    set scrollTop(val: boolean);
    /**
     * Is bar currently open?
     *
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Get transition duration in milliseconds
     *
     * @returns {number}
     */
    getTransitionDuration(): number;
    /**
     * Open bar
     *
     * @returns {Promise<this>}
     */
    open(): Promise<this>;
    /**
     * Close bar
     *
     * @returns {Promise<this>}
     */
    close(): Promise<this>;
    /**
     * Get styles for pushable elements
     *
     * @returns {object}
     */
    getPushStyles(): BartenderPushStyles;
}
