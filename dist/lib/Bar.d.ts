import type { BartenderBarOptions, BartenderBarPosition, BartenderBarMode, BartenderPushStyles } from './types';
import { Overlay } from './Overlay';
export declare class Bar {
    private ready;
    readonly overlayObj: Overlay;
    private _name;
    readonly el: HTMLElement;
    private _position;
    private _mode;
    private _overlay;
    private _permanent;
    private _scrollTop;
    private isOpened;
    constructor(name: string, options?: BartenderBarOptions);
    destroy(removeElement?: boolean): this;
    get name(): string;
    set name(name: string);
    get position(): BartenderBarPosition;
    set position(position: BartenderBarPosition);
    get mode(): BartenderBarMode;
    set mode(mode: BartenderBarMode);
    get overlay(): boolean;
    set overlay(val: boolean);
    get permanent(): boolean;
    set permanent(val: boolean);
    get scrollTop(): boolean;
    set scrollTop(val: boolean);
    isOpen(): boolean;
    getTransitionDuration(): number;
    open(): Promise<this>;
    close(): Promise<this>;
    getPushStyles(): BartenderPushStyles;
}