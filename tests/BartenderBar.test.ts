import { describe, it, expect, vi } from 'vitest'
import { BartenderBar, createDialog, waitForEvent } from './helpers'

describe('BartenderBar', () => {
  describe('constructor', () => {
    it('should throw if name is empty', () => {
      expect(() => new BartenderBar('', { el: createDialog() })).toThrow(
        'Bar name is required',
      )
    })

    it('should throw if element is missing', () => {
      expect(() => new BartenderBar('test')).toThrow('Element for bar')
    })

    it('should throw if element is not a dialog', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      expect(() => new BartenderBar('test', { el: div as any })).toThrow(
        'must be a <dialog> element',
      )

      div.remove()
    })

    it('should add CSS classes to element', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      expect(dialog.classList.contains('bartender-bar')).toBe(true)
      expect(dialog.classList.contains('bartender-bar--closed')).toBe(true)
      expect(
        dialog.classList.contains('bartender-bar--position-left'),
      ).toBe(true)
      expect(dialog.classList.contains('bartender-bar--mode-modal')).toBe(
        true,
      )
      expect(
        dialog.classList.contains('bartender-bar--has-overlay'),
      ).toBe(true)

      bar.destroy()
    })

    it('should apply default options', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      expect(bar.position).toBe('left')
      expect(bar.modal).toBe(true)
      expect(bar.overlay).toBe(true)
      expect(bar.permanent).toBe(false)
      expect(bar.scrollTop).toBe(true)

      bar.destroy()
    })

    it('should apply custom options', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', {
        el: dialog,
        position: 'right',
        modal: false,
        overlay: false,
        permanent: true,
        scrollTop: false,
      })

      expect(bar.position).toBe('right')
      expect(bar.modal).toBe(false)
      expect(bar.overlay).toBe(false)
      expect(bar.permanent).toBe(true)
      expect(bar.scrollTop).toBe(false)

      bar.destroy()
    })

    it('should resolve element from selector string', () => {
      const dialog = createDialog('bar-selector')
      const bar = new BartenderBar('test', { el: '#bar-selector' })

      expect(bar.el).toBe(dialog)

      bar.destroy()
    })
  })

  describe('position setter', () => {
    it('should update position CSS class', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      bar.position = 'right'
      expect(
        dialog.classList.contains('bartender-bar--position-right'),
      ).toBe(true)
      expect(
        dialog.classList.contains('bartender-bar--position-left'),
      ).toBe(false)

      bar.destroy()
    })

    it('should dispatch bartender-bar-updated event', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })
      const handler = vi.fn()
      dialog.addEventListener('bartender-bar-updated', handler)

      bar.position = 'top'
      expect(handler).toHaveBeenCalledTimes(1)

      bar.destroy()
    })

    it('should throw on invalid position', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      expect(() => {
        bar.position = 'invalid' as any
      }).toThrow('Invalid position')

      bar.destroy()
    })
  })

  describe('modal setter', () => {
    it('should update mode CSS class', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      bar.modal = false
      expect(
        dialog.classList.contains('bartender-bar--mode-standard'),
      ).toBe(true)
      expect(dialog.classList.contains('bartender-bar--mode-modal')).toBe(
        false,
      )

      bar.destroy()
    })

    it('should dispatch bartender-bar-updated event', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })
      const handler = vi.fn()
      dialog.addEventListener('bartender-bar-updated', handler)

      bar.modal = false
      expect(handler).toHaveBeenCalledTimes(1)

      bar.destroy()
    })
  })

  describe('overlay setter', () => {
    it('should toggle overlay CSS class', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      bar.overlay = false
      expect(
        dialog.classList.contains('bartender-bar--has-overlay'),
      ).toBe(false)

      bar.overlay = true
      expect(
        dialog.classList.contains('bartender-bar--has-overlay'),
      ).toBe(true)

      bar.destroy()
    })
  })

  describe('permanent setter', () => {
    it('should dispatch bartender-bar-updated event', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })
      const handler = vi.fn()
      dialog.addEventListener('bartender-bar-updated', handler)

      bar.permanent = true
      expect(handler).toHaveBeenCalledTimes(1)

      bar.destroy()
    })
  })

  describe('scrollTop setter', () => {
    it('should dispatch bartender-bar-updated event', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })
      const handler = vi.fn()
      dialog.addEventListener('bartender-bar-updated', handler)

      bar.scrollTop = false
      expect(handler).toHaveBeenCalledTimes(1)

      bar.destroy()
    })
  })

  describe('open()', () => {
    it('should call showModal() for modal bar', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog, modal: true })
      const spy = vi.spyOn(dialog, 'showModal')

      await bar.open()
      expect(spy).toHaveBeenCalled()

      bar.destroy()
    })

    it('should call show() for non-modal bar', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog, modal: false })
      const spy = vi.spyOn(dialog, 'show')

      await bar.open()
      expect(spy).toHaveBeenCalled()

      bar.destroy()
    })

    it('should add open CSS class and remove closed class', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      await bar.open()
      expect(dialog.classList.contains('bartender-bar--open')).toBe(true)
      expect(dialog.classList.contains('bartender-bar--closed')).toBe(false)

      bar.destroy()
    })

    it('should dispatch before-open and after-open events', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })
      const beforeHandler = vi.fn()
      const afterHandler = vi.fn()
      dialog.addEventListener('bartender-bar-before-open', beforeHandler)
      dialog.addEventListener('bartender-bar-after-open', afterHandler)

      await bar.open()
      expect(beforeHandler).toHaveBeenCalledTimes(1)
      expect(afterHandler).toHaveBeenCalledTimes(1)

      bar.destroy()
    })

    it('should scroll to top when scrollTop is true', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', {
        el: dialog,
        scrollTop: true,
      })
      const spy = vi.spyOn(dialog, 'scrollTo')

      await bar.open()
      expect(spy).toHaveBeenCalledWith(0, 0)

      bar.destroy()
    })

    it('should not scroll to top when scrollTop is false', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', {
        el: dialog,
        scrollTop: false,
      })
      const spy = vi.spyOn(dialog, 'scrollTo')

      await bar.open()
      expect(spy).not.toHaveBeenCalled()

      bar.destroy()
    })
  })

  describe('close()', () => {
    it('should call dialog close()', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })
      await bar.open()

      const spy = vi.spyOn(dialog, 'close')
      await bar.close()
      expect(spy).toHaveBeenCalled()

      bar.destroy()
    })

    it('should dispatch before-close and after-close events', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })
      const beforeHandler = vi.fn()
      const afterHandler = vi.fn()
      dialog.addEventListener('bartender-bar-before-close', beforeHandler)
      dialog.addEventListener('bartender-bar-after-close', afterHandler)

      await bar.open()
      const afterClose = waitForEvent(dialog, 'bartender-bar-after-close')
      bar.close()
      await afterClose

      expect(beforeHandler).toHaveBeenCalledTimes(1)
      expect(afterHandler).toHaveBeenCalledTimes(1)

      bar.destroy()
    })

    it('should remove open class and add closed class', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      await bar.open()
      const afterClose = waitForEvent(dialog, 'bartender-bar-after-close')
      bar.close()
      await afterClose

      expect(dialog.classList.contains('bartender-bar--open')).toBe(false)
      expect(dialog.classList.contains('bartender-bar--closed')).toBe(true)

      bar.destroy()
    })
  })

  describe('isOpen()', () => {
    it('should return false when bar is not open', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      expect(bar.isOpen()).toBe(false)

      bar.destroy()
    })

    it('should return true when bar is open', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      await bar.open()
      expect(bar.isOpen()).toBe(true)

      bar.destroy()
    })

    it('should return false after bar is closed', async () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      await bar.open()
      await bar.close()
      expect(bar.isOpen()).toBe(false)

      bar.destroy()
    })
  })

  describe('destroy()', () => {
    it('should remove CSS classes', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      bar.destroy()

      expect(dialog.classList.contains('bartender-bar')).toBe(false)
      expect(
        dialog.classList.contains('bartender-bar--position-left'),
      ).toBe(false)
    })

    it('should not remove dialog element from DOM', () => {
      const dialog = createDialog()
      const bar = new BartenderBar('test', { el: dialog })

      bar.destroy()

      expect(document.body.contains(dialog)).toBe(true)
    })
  })
})
