/**
 * Bartender bar
 */
declare class Bar {
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
    readonly switchTimeout: number;
    /** @property {boolean} focusTrap - Enable focus trap? */
    readonly focusTrap: boolean;
    /** @property {Bar[]} bars - Bars added to the instance */
    readonly bars: Bar[];
    /** @property {object} barDefaultOptions - Default options for the bars */
    readonly barDefaultOptions: BartenderBarOptions;
    /** @property {HTMLElement|null} previousOpenButton - Reference to the previous open button */
    private previousOpenButton?;
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
     * @param {HTMLElement|null} button - Reference to the element which was used to open the bar
     * @returns {Promise<Bar>}
     */
    open(name: string, button?: HTMLElement | null): Promise<Bar>;
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
     * @param {HTMLElement|null} button - Reference to the element which was used to toggle the bar
     * @throws {BartenderError}
     * @returns {Promise<Bar|null>}
     */
    toggle(name: string, button?: HTMLElement | null): Promise<Bar | null>;
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

declare interface BartenderBarDefaultOptions {
    position?: BartenderBarPosition,
    mode?: BartenderBarMode,
    overlay?: boolean,
    permanent?: boolean,
    scrollTop?: boolean,
    focusTrap?: boolean
}

declare type BartenderBarMode = 'float' | 'push' | 'reveal'

declare interface BartenderBarOptions extends BartenderBarDefaultOptions {
    el?: BartenderElementQuery,
}

declare type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'

declare type BartenderElementQuery = string | Element | null

declare interface BartenderOptions {
    debug?: boolean,
    el?: BartenderElementQuery,
    contentEl?: BartenderElementQuery,
    switchTimeout?: number,
    focusTrap?: boolean
}

declare interface BartenderPushElementOptions {
    bars?: Bar[],
    modes?: BartenderBarMode[]
    positions?: BartenderBarPosition[]
}

declare interface BartenderPushStyles {
    transform: string,
    transitionDuration: string,
    transitionTimingFunction: string,
}

/**
 * Bartender overlay
 */
declare class Overlay {
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

/**
 * Bartender pushable element
 */
declare class PushElement {
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

export { }
