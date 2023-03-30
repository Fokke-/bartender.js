import { BartenderBar } from './BartenderBar'
import { BartenderPushElement } from './BartenderPushElement'

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
  bars?: Array<BartenderBar>,
  modes?: Array<BartenderBarMode>
}

export interface BartenderPushStyles {
  transform: string,
  transitionDuration: string,
  transitionTimingFunction: string,
}

export type BartenderBars = Array<BartenderBar>
export type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'
export type BartenderBarMode = 'float' | 'push' | 'reveal'
export type BartenderPushableElements = Array<BartenderPushElement>
