import { Bartender } from './Bartender';
import { BartenderBar } from './BartenderBar';
export interface BartenderInstanceEventDetail {
    /** Bartender instance */
    bartender: Bartender;
}
export declare class BartenderInstanceEvent extends CustomEvent<BartenderInstanceEventDetail> {
    constructor(type: string, init: Omit<CustomEventInit, 'detail'> & {
        detail: BartenderInstanceEventDetail;
    });
}
export interface BartenderBarEventDetail {
    /** Bar object */
    bar: BartenderBar;
}
export declare class BartenderBarEvent extends CustomEvent<BartenderBarEventDetail> {
    constructor(type: string, init: Omit<CustomEventInit, 'detail'> & {
        detail: BartenderBarEventDetail;
    });
}
export interface BartenderBarUpdatedEventDetail extends BartenderBarEventDetail {
    /** Updated property */
    property: string;
    /** New value */
    value: any;
}
export declare class BartenderBarUpdatedEvent extends CustomEvent<BartenderBarUpdatedEventDetail> {
    constructor(type: string, init: Omit<CustomEventInit, 'detail'> & {
        detail: BartenderBarUpdatedEventDetail;
    });
}
export interface BartenderBarRemovedEventDetail {
    /** Bar name */
    name: string;
}
export declare class BartenderBarRemovedEvent extends CustomEvent<BartenderBarRemovedEventDetail> {
    constructor(type: string, init: Omit<CustomEventInit, 'detail'> & {
        detail: BartenderBarRemovedEventDetail;
    });
}
