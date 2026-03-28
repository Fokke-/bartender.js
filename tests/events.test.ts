import { describe, it, expect } from 'vitest'
import {
  Bartender,
  BartenderBar,
  BartenderInstanceEvent,
  BartenderBarEvent,
  BartenderBarUpdatedEvent,
  BartenderBarRemovedEvent,
  createDialog,
} from './helpers'

describe('Event classes', () => {
  it('BartenderInstanceEvent should be a CustomEvent', () => {
    const bartender = new Bartender()
    const event = new BartenderInstanceEvent('test', {
      detail: { bartender },
    })

    expect(event).toBeInstanceOf(CustomEvent)
    expect(event.detail.bartender).toBe(bartender)

    bartender.destroy()
  })

  it('BartenderBarEvent should be a CustomEvent', () => {
    const dialog = createDialog()
    const bar = new BartenderBar('test', { el: dialog })
    const event = new BartenderBarEvent('test', {
      detail: { bar },
    })

    expect(event).toBeInstanceOf(CustomEvent)
    expect(event.detail.bar).toBe(bar)

    bar.destroy()
  })

  it('BartenderBarUpdatedEvent should be a CustomEvent with property and value', () => {
    const dialog = createDialog()
    const bar = new BartenderBar('test', { el: dialog })
    const event = new BartenderBarUpdatedEvent('test', {
      detail: { bar, property: 'position', value: 'right' },
    })

    expect(event).toBeInstanceOf(CustomEvent)
    expect(event.detail.bar).toBe(bar)
    expect(event.detail.property).toBe('position')
    expect(event.detail.value).toBe('right')

    bar.destroy()
  })

  it('BartenderBarRemovedEvent should be a CustomEvent with name', () => {
    const event = new BartenderBarRemovedEvent('test', {
      detail: { name: 'mybar' },
    })

    expect(event).toBeInstanceOf(CustomEvent)
    expect(event.detail.name).toBe('mybar')
  })

  it('BartenderBarEvent should contain bar detail when dispatched', async () => {
    const bartender = new Bartender()
    const bar = bartender.addBar('test', { el: createDialog() })

    const eventDetail = await new Promise<any>((resolve) => {
      bar.el.addEventListener('bartender-bar-before-open', ((
        e: CustomEvent,
      ) => {
        resolve(e.detail)
      }) as EventListener)
      bartender.open('test')
    })

    expect(eventDetail.bar).toBe(bar)

    bartender.destroy()
  })

  it('BartenderBarRemovedEvent should contain bar name when dispatched', () => {
    const bartender = new Bartender()
    bartender.addBar('test', { el: createDialog() })

    let removedName: string | undefined
    window.addEventListener(
      'bartender-bar-removed',
      ((e: CustomEvent) => {
        removedName = e.detail.name
      }) as EventListener,
      { once: true },
    )

    bartender.removeBar('test')
    expect(removedName).toBe('test')

    bartender.destroy()
  })
})
