export type BartenderElementQuery = string | Element | null
export type BartenderBarPosition =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'center'

export interface BartenderOptions {
  /** Enable debug mode? */
  debug?: boolean
}

export interface BartenderBarDefaultOptions {
  /** Bar position */
  position?: BartenderBarPosition

  /** Open bar as a modal? */
  modal?: boolean

  /** Show shading overlay over content wrap when bar is open. */
  overlay?: boolean

  /** Bar is not closeable by clicking overlay of pressing esc key. */
  permanent?: boolean

  /** Bar will be scrolled to top after opening it. */
  scrollTop?: boolean
}

export interface BartenderBarOptions extends BartenderBarDefaultOptions {
  /** Bar element as selector string or reference to the element. */
  el?: BartenderElementQuery
}
