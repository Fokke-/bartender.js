import type { BartenderOptions, BartenderBarOptions, BartenderPushElementOptions } from './types';
import { BartenderError } from './BartenderError';
import { Bar } from './Bar';
import { PushElement } from './PushElement';
/**
 * Class for creating accessible off-canvas bars.
 */
export declare class Bartender {
    private queue;
    private resizeDebounce;
    debug: boolean;
    readonly el: HTMLElement;
    readonly contentEl: HTMLElement;
    readonly switchTimeout: number;
    readonly bars: Bar[];
    private pushableElements;
    private barDefaultOptions;
    constructor(options?: BartenderOptions, barOptions?: BartenderBarOptions);
    destroy(): void;
    getBar(name: string): Bar | null;
    private getOpenBar;
    addBar(name: string, userOptions?: BartenderBarOptions): Bar | BartenderError;
    private openBar;
    open(name: string): Promise<Bar | Error>;
    private closeBar;
    close(): Promise<Bar | null>;
    toggle(name: string): Promise<Bar | BartenderError | null>;
    addPushElement(options?: BartenderPushElementOptions): PushElement;
    private pushElements;
    private pullElements;
    private onKeydown;
    private onResize;
}
