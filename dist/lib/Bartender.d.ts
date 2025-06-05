import { BartenderOptions, BartenderBarDefaultOptions, BartenderBarOptions } from './types';
import { BartenderBar } from './BartenderBar';
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
    /** Handler for keydown events */
    private onKeydownHandler;
    /** Handler for bartender-bar-before-open events */
    private onBarBeforeOpenHandler;
    /** Handler for bartender-bar-before-close events */
    private onBarBeforeCloseHandler;
    /** Handler for bartender-bar-backdrop-click events */
    private onBarBackdropClickHandler;
    /**
     * Create a new Bartender instance
     */
    constructor(options?: BartenderOptions, barDefaultOptions?: BartenderBarDefaultOptions);
    /** Enable debug mode? */
    get debug(): boolean;
    set debug(val: boolean);
    /**
     * Get bar instance by name.
     */
    getBar(name: string): BartenderBar | null;
    /**
     * Get the topmost open bar instance.
     */
    private getOpenBar;
    /**
     * Add a new bar
     */
    addBar(name: string, options?: BartenderBarOptions): BartenderBar;
    /**
     * Remove bar instance by name
     */
    removeBar(name: string): this;
    /**
     * Open bar
     *
     * Resolves after the bar has opened.
     */
    open(bar: BartenderBar | string, keepOtherBarsOpen?: boolean): Promise<BartenderBar>;
    /**
     * Close bar
     *
     * If bar is undefined, the topmost bar will be closed. Resolves after the bar has closed.
     */
    close(bar?: BartenderBar | string): Promise<BartenderBar | null>;
    /**
     * Close all bars
     *
     * Resolves after all the bars have been closed.
     */
    closeAll(closeNonModalBars?: boolean): Promise<this>;
    /**
     * Toggle bar open/closed state.
     *
     * Resolves after the bar has opened or closed.
     */
    toggle(bar?: BartenderBar | string, keepOtherBarsOpen?: boolean): Promise<BartenderBar | null>;
    /**
     * Destroy Bartender instance
     */
    destroy(): this;
}
