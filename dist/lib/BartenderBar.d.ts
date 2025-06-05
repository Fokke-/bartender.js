import { BartenderBarOptions, BartenderBarPosition } from './types';
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
