import type { BartenderOptions, BartenderBarDefaultOptions, BartenderBarOptions, BartenderElementQuery, BartenderPushElementOptions } from './types';
import { Bar } from './Bar';
import { PushElement } from './PushElement';
/**
 * Class for creating accessible off-canvas bars.
 */
export declare class Bartender {
    /** @property {boolean} debug - Enable debug mode? */
    private _debug;
    /** @property {HTMLElement} el - Main element */
    readonly el: HTMLElement;
    /** @property {HTMLElement} contentEl - Content element */
    readonly contentEl: HTMLElement;
    /** @property {number} switchTimeout - Time to wait in milliseconds until another bar is opened */
    switchTimeout: number;
    /** @property {Bar[]} bars - Bars added to the instance */
    readonly bars: Bar[];
    /** @property {object} barDefaultOptions - Default options for the bars */
    readonly barDefaultOptions: BartenderBarOptions;
    /** @property {HTMLElement|null} returnFocus - Reference to the element to which focus will be restored after closing the bar */
    private returnFocus?;
    /** @property {PushElement[]} pushableElements - Pushable elements added to the instance */
    private pushableElements;
    /** @property {object} queue - Queue for actions */
    private queue;
    /** @property {Function} resizeDebounce - Debouncer for resizing */
    private resizeDebounce;
    /** @property {Function} resizeDebounce - Debouncer for resizing */
    private onBarUpdateHandler;
    /** @property {Function} onKeydownHandler - Handler for keydown event */
    private onKeydownHandler;
    /** @property {Function} onKeydownHandler - Handler for resize event */
    private onResizeHandler;
    /**
     * Create a new Bartender instance
     *
     * @param {object} options - Instance options
     * @param {object} barOptions - Default options for bars
     * @throws {BartenderError}
     */
    constructor(options?: BartenderOptions, barOptions?: BartenderBarDefaultOptions);
    /** @type {boolean} */
    get debug(): boolean;
    /** @type {boolean} */
    set debug(val: boolean);
    /**
     * Destroy Bartender instance
     *
     * @returns {Promise<this>}
     */
    destroy(): Promise<this>;
    /**
     * Get bar by name
     *
     * @param {string} name - Bar name
     * @returns {object|null}
     */
    getBar(name: string): Bar | null;
    /**
     * Get currently open bar
     *
     * @returns {object|null}
     */
    private getOpenBar;
    /**
     * Add a new bar
     *
     * @param {string} name - Unique name for the bar
     * @param {object} options - Bar options
     * @throws {BartenderError}
     * @returns {object} Bar object
     */
    addBar(name: string, options?: BartenderBarOptions): Bar;
    /**
     * Remove bar
     *
     * @param {string} name - Bar name
     * @throws {BartenderError}
     * @returns {Promise<this>}
     */
    removeBar(name: string): Promise<this>;
    /**
     * Open bar
     *
     * @param {string} name - Bar name
     * @throws {BartenderError}
     * @returns {Promise<Bar>}
     */
    private openBar;
    /**
     * Open bar
     *
     * @param {string} name - Bar name
     * @param {HTMLElement|null} returnFocus - Reference to the element to which focus will be restored after closing the bar
     * @returns {Promise<Bar>}
     */
    open(name: string, returnFocus?: HTMLElement | null): Promise<Bar>;
    /**
     * Close bar
     *
     * @param {string} name - Bar name
     * @param {boolean} switching - Will another bar open immediately after closing?
     * @returns {Promise<Bar|null>}
     */
    private closeBar;
    /**
     * Close bar
     *
     * @param {string} name - Bar name
     * @returns {Promise<Bar|null>}
     */
    close(name?: string): Promise<Bar | null>;
    /**
     * Toggle bar
     *
     * @param {string} name - Bar name
     * @param {HTMLElement|null} returnFocus - Reference to the element to which focus will be restored after closing the bar
     * @throws {BartenderError}
     * @returns {Promise<Bar|null>}
     */
    toggle(name: string, returnFocus?: HTMLElement | null): Promise<Bar | null>;
    /**
     * Add a new pushable element
     *
     * @param {BartenderElementQuery} el - Pushable element
     * @param {object} options - Options for pushable element
     * @returns {PushElement}
     */
    addPushElement(el: BartenderElementQuery, options?: BartenderPushElementOptions): PushElement;
    /**
     * Remove pushable element
     *
     * @param {Element} el - Element to remove
     * @throws {BartenderError}
     * @returns {PushElement[]}
     */
    removePushElement(el: Element): PushElement[];
    /**
     * Push elements
     *
     * @param {Bar|null} bar - The bar from which the styles are fetched
     * @returns {PushElement[]}
     */
    private pushElements;
    /**
     * Pull elements and return them to the original position
     *
     * @param {Bar|null} bar - The bar from which the styles are fetched
     * @returns {PushElement[]}
     */
    private pullElements;
    /**
     * Handler for bartender-bar-updated event
     *
     * @returns {void}
     */
    private onBarUpdate;
    /**
     * Handler for keydown event
     *
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    private onKeydown;
    /**
     * Handler for resize event
     *
     * @returns {void}
     */
    private onResize;
}
