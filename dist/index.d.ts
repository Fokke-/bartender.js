/**
 * Bartender bar
 */
declare class Bar {
    /** @property {boolean} debug - Enable debug mode? */
    debug: boolean;
    /** @property {boolean} initialized - Is bar initialized? */
    private initialized;
    /** @property {string} _name - Bar name */
    private _name;
    /** @property {HTMLDialogElement} el - Bar element */
    readonly el: HTMLDialogElement;
    /** @property {string} _position - Bar position */
    private _position;
    /** @property {boolean} _overlay - Enable overlay? */
    private _overlay;
    /** @property {boolean} _permanent - Enable permanent mode? */
    private _permanent;
    /** @property {boolean} _scrollTop - Scroll to the top when bar is opened? */
    private _scrollTop;
    /** @property {boolean} isOpened - Is the bar currently open? */
    private isOpened;
    /** @property {Function} onCloseHandler - Handler for dialog close event */
    private onCloseHandler;
    /** @property {Function} onClickHandler - Handler for dialog click event */
    private onClickHandler;
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
    set name(val: string);
    /** @type {string} */
    get position(): BartenderBarPosition;
    /**
     * @type {string}
     * @throws {BartenderError}
     */
    set position(val: BartenderBarPosition);
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
     * Get transition properties for an element
     *
     * @param {Element} el - Element to get properties for
     * @returns {BartenderTransitionProperties}
     */
    getTransitionProperties(el: Element): BartenderTransitionProperties;
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
     * Handler for dialog close event
     *
     * @returns {Promise<this>}
     */
    private onClose;
    /**
     * Handler for dialog click event
     *
     * @param {MouseEvent} event - Click event
     * @returns {Promise<this>}
     */
    private onClick;
    /**
     * Get styles for pushable elements
     *
     * @returns {Promise<BartenderPushStyles>}
     */
    getPushStyles(): Promise<BartenderPushStyles>;
}

/**
 * Class for creating accessible off-canvas bars.
 */
export declare class Bartender {
    /** @property {boolean} debug - Enable debug mode? */
    private _debug;
    /** @property {number} switchTimeout - Time to wait in milliseconds until another bar is opened */
    switchTimeout: number;
    /** @property {Bar[]} bars - Bars added to the instance */
    readonly bars: Bar[];
    /** @property {object} barDefaultOptions - Default options for the bars */
    private readonly barDefaultOptions;
    /** @property {boolean} Switching - Will another bar open immediately after the current bar is closed? */
    private switching;
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
     * @returns {this}
     */
    removeBar(name: string): this;
    /**
     * Open bar
     *
     * @param {string} name - Bar name
     * @throws {BartenderError}
     * @returns {Promise<Bar>}
     */
    open(name: string): Promise<Bar>;
    /**
     * Close bar
     *
     * @param {string|undefined} name - Bar name. Leave empty to close any open bar.
     * @param {boolean} _switching - For internal use only. Will another bar open immediately after closing?
     * @returns {Promise<Bar|null>}
     */
    close(name?: string, _switching?: boolean): Promise<Bar | null>;
    /**
     * Toggle bar
     *
     * @param {string} name - Bar name
     * @throws {BartenderError}
     * @returns {Promise<Bar|null>}
     */
    toggle(name: string): Promise<Bar | null>;
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
     * @param {KeyboardEvent} event - Keyboard event
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

export declare interface BartenderBarDefaultOptions {
    position?: BartenderBarPosition
    overlay?: boolean
    permanent?: boolean
    scrollTop?: boolean
}

export declare interface BartenderBarOptions extends BartenderBarDefaultOptions {
    el?: BartenderElementQuery
}

export declare type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'

export declare type BartenderElementQuery = string | Element | null

export declare interface BartenderOptions {
    debug?: boolean
    el?: BartenderElementQuery
    contentEl?: BartenderElementQuery
    switchTimeout?: number
}

export declare interface BartenderPushElementOptions {
    bars?: Bar[]
    positions?: BartenderBarPosition[]
}

export declare interface BartenderPushStyles {
    transform: string
    transitionDuration: string
    transitionTimingFunction: string
}

export declare interface BartenderTransitionProperties {
    timingFunction?: string
    duration: number
}

/**
 * Bartender pushable element
 */
declare class PushElement {
    /** @property {HTMLElement} el - Element to push */
    readonly el: HTMLElement;
    /** @property {Bar[]} bars - Matched bars */
    private readonly bars;
    /** @property {string[]} positions - Matched positions */
    private readonly positions;
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
