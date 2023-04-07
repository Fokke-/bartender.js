import { Bar } from './Bar'

export type BartenderElementQuery = string | Element | null
export type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'
export type BartenderBarMode = 'float' | 'push' | 'reveal'

export interface BartenderOptions {
  debug?: boolean,
  el?: BartenderElementQuery,
  contentEl?: BartenderElementQuery,
  fixedElementContainer?: BartenderElementQuery,
  switchTimeout?: number,
  focusTrap?: boolean
}

export interface BartenderBarOptions {
  el?: BartenderElementQuery,
  position?: BartenderBarPosition,
  mode?: BartenderBarMode,
  overlay?: boolean,
  permanent?: boolean,
  scrollTop?: boolean,
  focusTrap?: boolean
}

export interface BartenderPushElementOptions {
  el?: BartenderElementQuery,
  bars?: Bar[],
  modes?: BartenderBarMode[]
  positions?: BartenderBarPosition[]
}

export interface BartenderPushStyles {
  transform: string,
  transitionDuration: string,
  transitionTimingFunction: string,
}

