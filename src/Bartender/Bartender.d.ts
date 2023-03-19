import { BartenderBar } from './BartenderBar'

export interface BartenderOptions {
  debug?: boolean,
  mainEl?: Element,
  mainElSelector?: string,
  contentEl?: Element,
  contentElSelector?: string,
}

export type BartenderBars = {
  [key: string]: BartenderBar
}

export type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'
export type BartenderBarMode = 'float' | 'push' | 'reveal'

export interface BartenderBarOptions {
  el?: Element,
  elSelector?: string,
  position?: BartenderBarPosition,
  mode?: 'float' | 'push' | 'reveal',
  permanent?: boolean,
  switchTimeout?: number,
}
