/**
 * Class for creating accessible off-canvas bars.
 */
export declare class Bartender {
    /** Enable debug mode? */
    private _debug;
    /** Bars added to the instance */
    readonly bars: BartenderBar[];
    /** Currently open bars */
    readonly openBars: BartenderBar[];
    /** Default options for the bars */
    private readonly barDefaultOptions;
    /** Handler for keydown events */
    private onKeydownHandler;
    /** Handler for bartender-bar-before-open events */
    private onBarBeforeOpenHandler;
    /** Handler for bartender-bar-before-close events */
    private onBarBeforeCloseHandler;
    /** Handler for bartender-bar-backdrop-click events */
    private onBarBackdropClickHandler;
    /**
     * Create a new Bartender instance
     */
    constructor(options?: BartenderOptions, barDefaultOptions?: BartenderBarDefaultOptions);
    /** Enable debug mode? */
    get debug(): boolean;
    set debug(val: boolean);
    /**
     * Get bar instance by name.
     */
    getBar(name: string): BartenderBar | null;
    /**
     * Get the topmost open bar instance.
     */
    private getOpenBar;
    /**
     * Add a new bar
     */
    addBar(name: string, options?: BartenderBarOptions): BartenderBar;
    /**
     * Remove bar instance by name
     */
    removeBar(name: string): this;
    /**
     * Open bar
     *
     * Resolves after the bar has opened.
     */
    open(bar: BartenderBar | string, keepOtherBarsOpen?: boolean): Promise<BartenderBar>;
    /**
     * Close bar
     *
     * If bar is undefined, the topmost bar will be closed. Resolves after the bar has closed.
     */
    close(bar?: BartenderBar | string): Promise<BartenderBar | null>;
    /**
     * Close all bars
     *
     * Resolves after all the bars have been closed.
     */
    closeAll(closeNonModalBars?: boolean): Promise<this>;
    /**
     * Toggle bar open/closed state.
     *
     * Resolves after the bar has opened or closed.
     */
    toggle(bar?: BartenderBar | string, keepOtherBarsOpen?: boolean): Promise<BartenderBar | null>;
    /**
     * Destroy Bartender instance
     */
    destroy(): this;
}

/**
 * Bartender bar
 */
export declare class BartenderBar {
    /** Enable debug mode? */
    debug: boolean;
    /** Is bar initialized? */
    private initialized;
    /** Bar name */
    private _name;
    /** Bar element */
    readonly el: HTMLDialogElement;
    /** Bar position */
    private _position;
    /** Is the bar a modal? */
    private _modal;
    /** Enable overlay? */
    private _overlay;
    /** Enable permanent mode? */
    private _permanent;
    /** Scroll to the top when bar is opened? */
    private _scrollTop;
    /** Is the bar currently open? */
    private isOpened;
    /** Handler for dialog close event */
    private onCloseHandler;
    /** Handler for dialog click event */
    private onClickHandler;
    /**
     * Create a new bar
     */
    constructor(name: string, options?: BartenderBarOptions);
    /**
     * Destroy bar instance
     */
    destroy(): this;
    /** Bar name */
    get name(): string;
    set name(val: string);
    /** Bar position */
    get position(): BartenderBarPosition;
    set position(val: BartenderBarPosition);
    /** Is the bar a modal? */
    get modal(): boolean;
    set modal(val: boolean);
    /** Enable overlay? */
    get overlay(): boolean;
    set overlay(val: boolean);
    /** Enable permanent mode? */
    get permanent(): boolean;
    set permanent(val: boolean);
    /** Scroll to the top when bar is opened? */
    get scrollTop(): boolean;
    set scrollTop(val: boolean);
    /**
     * Is bar currently open?
     */
    isOpen(): boolean;
    /**
     * Open bar
     */
    open(): Promise<this>;
    /**
     * Close bar
     */
    close(): Promise<this>;
    /**
     * Scroll bar to the top
     */
    scrollToTop(): this;
    /**
     * Get transition duration in milliseconds
     */
    getTransitionDuration(): number;
}

export declare interface BartenderBarDefaultOptions {
    /** Bar position */
    position?: BartenderBarPosition

    /** Open bar as a modal? */
    modal?: boolean

    /** Show shading overlay over content wrap when bar is open. */
    overlay?: boolean

    /** Bar is not closeable by clicking overlay of pressing esc key. */
    permanent?: boolean

    /** Bar will be scrolled to top after opening it. */
    scrollTop?: boolean
}

export declare interface BartenderBarOptions extends BartenderBarDefaultOptions {
    /** Bar element as selector string or reference to the element. */
    el?: BartenderElementQuery
}

export declare type BartenderBarPosition =
| 'left'
| 'right'
| 'top'
| 'bottom'
| 'center'

export declare type BartenderElementQuery = string | Element | null

export declare interface BartenderOptions {
    /** Enable debug mode? */
    debug?: boolean
}

export { }
