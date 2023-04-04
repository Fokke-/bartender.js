import type { BartenderPushElementOptions, BartenderBarMode, BartenderPushStyles, BartenderBarPosition } from './types';
import { Bar } from './Bar';
export declare class PushElement {
    private el;
    readonly bars: Bar[];
    readonly modes: BartenderBarMode[];
    readonly positions: BartenderBarPosition[];
    private isPushed;
    constructor(options?: BartenderPushElementOptions);
    push(bar: Bar, pushStyles: BartenderPushStyles): this;
    pull(pushStyles: BartenderPushStyles): this;
}
