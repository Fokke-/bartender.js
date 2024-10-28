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
    /** Handler for keydown event */
    private onKeydownHandler;
    /**
     * Create a new Bartender instance
     */
    constructor(options?: BartenderOptions, barDefaultOptions?: BartenderBarDefaultOptions);
    /** Enable debug mode? */
    get debug(): boolean;
    set debug(val: boolean);
    /**
     * Destroy Bartender instance
     */
    destroy(): this;
    /**
     * Get bar by name
     */
    getBar(name: string): BartenderBar | null;
    /**
     * Get currently open bar
     */
    private getOpenBar;
    /**
     * Add a new bar
     */
    addBar(name: string, options?: BartenderBarOptions): BartenderBar;
    /**
     * Remove bar
     */
    removeBar(name: string): this;
    /**
     * Open bar
     */
    open(bar: BartenderBar | string, options?: BartenderOpenOptions): BartenderBar;
    /**
     * Close bar
     */
    close(bar?: BartenderBar | string): BartenderBar | null;
    /**
     * Close all bars
     */
    closeAll(closeNonModalBars?: boolean): this;
    /**
     * Toggle bar
     */
    toggle(bar?: BartenderBar | string, options?: BartenderOpenOptions): BartenderBar | null;
    /**
     * Handler for keydown event
     */
    private onKeydown;
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
    /** Enable overlay? */
    private _overlay;
    /** Enable permanent mode? */
    private _permanent;
    /** Scroll to the top when bar is opened? */
    private _scrollTop;
    /** Is the bar currently open? */
    private isOpened;
    /** Is the bar opened in modal mode? */
    isModal: boolean;
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
    open(options?: BartenderOpenOptions): Promise<this>;
    /**
     * Close bar
     */
    close(): Promise<this>;
    /**
     * Handler for dialog close event
     */
    private onClose;
    /**
     * Scroll bar to the top
     */
    scrollToTop(): this;
    /**
     * Handler for dialog click event
     */
    private onClick;
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

export declare interface BartenderOpenOptions {
    /** Close other bars? */
    closeOtherBars?: boolean

    /** Open as modal? */
    modal?: boolean
}

export declare interface BartenderOptions {
    debug?: boolean
    el?: BartenderElementQuery
    contentEl?: BartenderElementQuery
}

export { }


declare global {
    interface Window {
        bartender: Bartender;
    }
}
