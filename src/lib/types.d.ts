import { BartenderBar } from './BartenderBar'

export type BartenderElementQuery = string | Element | null
export type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'

export interface BartenderOptions {
  debug?: boolean
  el?: BartenderElementQuery
  contentEl?: BartenderElementQuery
  switchTimeout?: number
}

export interface BartenderBarDefaultOptions {
  position?: BartenderBarPosition
  overlay?: boolean
  permanent?: boolean
  scrollTop?: boolean
}

export interface BartenderBarOptions extends BartenderBarDefaultOptions {
  el?: BartenderElementQuery
}

export interface BartenderPushElementOptions {
  bars?: BartenderBar[]
  positions?: BartenderBarPosition[]
}

export interface BartenderPushStyles {
  transform: string
  transitionDuration: string
  transitionTimingFunction: string
}

export interface BartenderTransitionProperties {
  timingFunction?: string
  duration: number
}
