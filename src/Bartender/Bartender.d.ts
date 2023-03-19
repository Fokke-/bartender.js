import { BartenderBar } from './BartenderBar'

export interface BartenderOptions {
  debug?: boolean,
  mainEl?: HTMLElement | HTMLBodyElement | null,
  mainElSelector?: string,
  contentEl?: HTMLElement | null,
  contentElSelector?: string,
}

export type BartenderBars = {
  [key: string]: BartenderBar
}

export type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'
export type BartenderBarMode = 'float' | 'push' | 'reveal'

export interface BartenderBarOptions {
  el?: HTMLElement | null,
  elSelector?: string,
  position?: BartenderBarPosition,
  mode?: 'float' | 'push' | 'reveal',
  permanent?: boolean,
  switchTimeout?: number,
}
