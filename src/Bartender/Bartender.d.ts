import { BartenderBar } from './BartenderBar'

export interface BartenderOptions {
  debug?: boolean,
  mainEl?: string | Element | null,
  contentEl?: string | Element | null,
}

export type BartenderBars = {
  [key: string]: BartenderBar
}

export interface BartenderBarOptions {
  position?: string,
  el?: string | Element | null,
}
