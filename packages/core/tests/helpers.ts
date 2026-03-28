export { Bartender, BartenderBar } from '../dist/bartender.js'
export {
  BartenderInstanceEvent,
  BartenderBarEvent,
  BartenderBarUpdatedEvent,
  BartenderBarRemovedEvent,
} from '../dist/bartender.js'

export function createDialog(id?: string): HTMLDialogElement {
  const dialog = document.createElement('dialog')
  if (id) {
    dialog.id = id
  }
  document.body.appendChild(dialog)
  return dialog
}

export function waitForEvent(
  target: EventTarget,
  eventName: string,
): Promise<Event> {
  return new Promise((resolve) => {
    target.addEventListener(eventName, resolve, { once: true })
  })
}
