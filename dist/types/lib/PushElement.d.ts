import type { BartenderPushElementOptions, BartenderBarMode, BartenderPushStyles } from '../Bartender.d';
import { Bar } from './Bar';
export declare class PushElement {
    private el;
    readonly bars: Array<Bar>;
    readonly modes: Array<BartenderBarMode>;
    private isPushed;
    constructor(options?: BartenderPushElementOptions);
    push(bar: Bar, pushStyles: BartenderPushStyles): this;
    pull(): this;
}
