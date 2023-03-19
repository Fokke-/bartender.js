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

export interface BartenderBarOptions {
  el?: Element,
  elSelector?: string,
  position: 'left' | 'right' | 'top' | 'bottom',
}
