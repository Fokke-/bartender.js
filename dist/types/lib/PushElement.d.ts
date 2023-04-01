import type { BartenderPushElementOptions, BartenderBarMode, BartenderPushStyles } from './types';
import { Bar } from './Bar';
export declare class PushElement {
    private el;
    readonly bars: Bar[];
    readonly modes: BartenderBarMode[];
    private isPushed;
    constructor(options?: BartenderPushElementOptions);
    push(bar: Bar, pushStyles: BartenderPushStyles): this;
    pull(): this;
}
