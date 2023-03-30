import { BartenderBar } from './BartenderBar'

export type BartenderElementQuery = string | Element | null

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

export type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'
export type BartenderBarMode = 'float' | 'push' | 'reveal'
