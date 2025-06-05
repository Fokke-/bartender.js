import { Bartender } from './Bartender'
import { BartenderBar } from './BartenderBar'

export interface BartenderInstanceEventDetail {
  /** Bartender instance */
  bartender: Bartender
}

export class BartenderInstanceEvent extends CustomEvent<BartenderInstanceEventDetail> {
  constructor(
    type: string,
    init: Omit<CustomEventInit, 'detail'> & {
      detail: BartenderInstanceEventDetail
    },
  ) {
    super(type, init)
  }
}

export interface BartenderBarEventDetail {
  /** Bar object */
  bar: BartenderBar
}

export class BartenderBarEvent extends CustomEvent<BartenderBarEventDetail> {
  constructor(
    type: string,
    init: Omit<CustomEventInit, 'detail'> & { detail: BartenderBarEventDetail },
  ) {
    super(type, init)
  }
}

export interface BartenderBarUpdatedEventDetail
  extends BartenderBarEventDetail {
  /** Updated property */
  property: string

  /** New value */
  value: any
}

export class BartenderBarUpdatedEvent extends CustomEvent<BartenderBarUpdatedEventDetail> {
  constructor(
    type: string,
    init: Omit<CustomEventInit, 'detail'> & {
      detail: BartenderBarUpdatedEventDetail
    },
  ) {
    super(type, init)
  }
}

export interface BartenderBarRemovedEventDetail {
  /** Bar name */
  name: string
}

export class BartenderBarRemovedEvent extends CustomEvent<BartenderBarRemovedEventDetail> {
  constructor(
    type: string,
    init: Omit<CustomEventInit, 'detail'> & {
      detail: BartenderBarRemovedEventDetail
    },
  ) {
    super(type, init)
  }
}
