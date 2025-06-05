import {
  BartenderInstanceEvent,
  BartenderBarEvent,
  BartenderBarUpdatedEvent,
  BartenderBarRemovedEvent,
} from './events'

declare global {
  interface WindowEventMap {
    'bartender-init': BartenderInstanceEvent
    'bartender-destroyed': BartenderInstanceEvent
    'bartender-bar-added': BartenderBarEvent
    'bartender-bar-removed': BartenderBarRemovedEvent
    'bartender-bar-updated': BartenderBarUpdatedEvent
    'bartender-bar-before-open': BartenderBarEvent
    'bartender-bar-after-open': BartenderBarEvent
    'bartender-bar-before-close': BartenderBarEvent
    'bartender-bar-after-close': BartenderBarEvent
  }
}
