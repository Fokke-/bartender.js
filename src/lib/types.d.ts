export type BartenderElementQuery = string | Element | null
export type BartenderBarPosition = 'left' | 'right' | 'top' | 'bottom'

export interface BartenderOptions {
  debug?: boolean
  el?: BartenderElementQuery
  contentEl?: BartenderElementQuery
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

export interface BartenderOpenOptions {
  /** Close other bars? */
  closeOtherBars?: boolean

  /** Open as modal? */
  modal?: boolean
}
