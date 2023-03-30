import { BartenderBar } from './lib/Bar'

export type BartenderElementQuery = string | Element | null
export type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'
export type BartenderBarMode = 'float' | 'push' | 'reveal'

export interface BartenderOptions {
  debug?: boolean,
  el?: BartenderElementQuery,
  contentEl?: BartenderElementQuery,
  switchTimeout?: number,
}

export interface BartenderBarOptions {
  el?: BartenderElementQuery,
  position?: BartenderBarPosition,
  mode?: 'float' | 'push' | 'reveal',
  overlay?: boolean,
  permanent?: boolean,
  scrollTop?: boolean,
}

export interface BartenderPushElementOptions {
  el?: BartenderElementQuery,
  bars?: BartenderBar[],
  modes?: BartenderBarMode[]
}

export interface BartenderPushStyles {
  transform: string,
  transitionDuration: string,
  transitionTimingFunction: string,
}

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
