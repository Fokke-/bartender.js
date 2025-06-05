import { BartenderBar } from './BartenderBar';
export interface BartenderBarEventDetail {
    /** Bar object */
    bar: BartenderBar;
}
export declare class BartenderBarEvent extends CustomEvent<BartenderBarEventDetail> {
    constructor(type: string, init: Omit<CustomEventInit, 'detail'> & {
        detail: BartenderBarEventDetail;
    });
}
