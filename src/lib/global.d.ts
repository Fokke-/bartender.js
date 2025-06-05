import { BartenderBarEvent } from './BartenderBarEvent'

declare global {
  interface WindowEventMap {
    'bartender-bar-before-open': BartenderBarEvent
    'bartender-bar-before-close': BartenderBarEvent
  }
}
