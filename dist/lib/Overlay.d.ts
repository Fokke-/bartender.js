export declare class Overlay {
    private _name;
    private _enabled;
    readonly el: HTMLElement;
    constructor(name: string, enabled?: boolean);
    destroy(): this;
    get name(): string;
    set name(name: string);
    get enabled(): boolean;
    set enabled(val: boolean);
    show(): this;
    hide(): this;
}
