import { BartenderBar } from './BartenderBar'

export interface BartenderOptions {
  debug?: boolean,
  mainEl?: HTMLElement | HTMLBodyElement | null,
  mainElSelector?: string,
  contentEl?: HTMLElement | null,
  contentElSelector?: string,
  switchTimeout?: number,
}

export type BartenderBars = Array<BartenderBar>
export type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'
export type BartenderBarMode = 'float' | 'push' | 'reveal'

export interface BartenderBarOptions {
  el?: HTMLElement | null,
  elSelector?: string,
  position?: BartenderBarPosition,
  mode?: 'float' | 'push' | 'reveal',
  permanent?: boolean,
}

export interface BartenderPushElementOptions {
  el?: HTMLElement | HTMLBodyElement | null,
  elSelector?: string,
}

export interface BartenderPushStyles {
  transform: string,
  transitionDuration: string,
  transitionTimingFunction: string,
}

export type BartenderPushableElements = Array<HTMLElement>
