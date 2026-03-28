import { describe, it, expect, vi } from 'vitest'
import { Bartender, BartenderBar, createDialog, waitForEvent } from './helpers'

describe('Bartender', () => {
  describe('constructor', () => {
    it('should add bartender-ready class to body', () => {
      const bartender = new Bartender()
      expect(document.body.classList.contains('bartender-ready')).toBe(true)
      bartender.destroy()
    })

    it('should dispatch bartender-init event', () => {
      const handler = vi.fn()
      window.addEventListener('bartender-init', handler)

      const bartender = new Bartender()
      expect(handler).toHaveBeenCalledTimes(1)

      bartender.destroy()
      window.removeEventListener('bartender-init', handler)
    })

    it('should set debug option', () => {
      const bartender = new Bartender({ debug: true })
      expect(bartender.debug).toBe(true)
      bartender.destroy()
    })
  })

  describe('addBar()', () => {
    it('should add a bar', () => {
      const bartender = new Bartender()
      const dialog = createDialog()
      const bar = bartender.addBar('test', { el: dialog })

      expect(bar).toBeInstanceOf(BartenderBar)
      expect(bartender.bars).toHaveLength(1)

      bartender.destroy()
    })

    it('should throw on duplicate name', () => {
      const bartender = new Bartender()
      bartender.addBar('test', { el: createDialog() })

      expect(() => {
        bartender.addBar('test', { el: createDialog() })
      }).toThrow("already defined")

      bartender.destroy()
    })

    it('should throw on empty name', () => {
      const bartender = new Bartender()

      expect(() => {
        bartender.addBar('', { el: createDialog() })
      }).toThrow('Bar name is required')

      bartender.destroy()
    })

    it('should throw if element is already used by another bar', () => {
      const bartender = new Bartender()
      const dialog = createDialog()
      bartender.addBar('bar1', { el: dialog })

      expect(() => {
        bartender.addBar('bar2', { el: dialog })
      }).toThrow('already being used')

      bartender.destroy()
    })

    it('should apply barDefaultOptions', () => {
      const bartender = new Bartender({}, { position: 'right' })
      const bar = bartender.addBar('test', { el: createDialog() })

      expect(bar.position).toBe('right')

      bartender.destroy()
    })
  })

  describe('getBar()', () => {
    it('should return bar by name', () => {
      const bartender = new Bartender()
      const bar = bartender.addBar('test', { el: createDialog() })

      expect(bartender.getBar('test')).toBe(bar)

      bartender.destroy()
    })

    it('should return null for unknown name', () => {
      const bartender = new Bartender()

      expect(bartender.getBar('unknown')).toBeNull()

      bartender.destroy()
    })
  })

  describe('getOpenBar()', () => {
    it('should return null when no bars are open', () => {
      const bartender = new Bartender()
      expect(bartender.getOpenBar()).toBeNull()
      bartender.destroy()
    })

    it('should return the topmost open bar', async () => {
      const bartender = new Bartender()
      bartender.addBar('bar1', { el: createDialog() })
      const bar2 = bartender.addBar('bar2', { el: createDialog() })

      await bartender.open('bar1')
      await bartender.open('bar2', true)

      expect(bartender.getOpenBar()).toBe(bar2)

      bartender.destroy()
    })

    it('should filter by modal parameter', async () => {
      const bartender = new Bartender()
      bartender.addBar('modal', {
        el: createDialog(),
        modal: true,
      })
      bartender.addBar('nonmodal', {
        el: createDialog(),
        modal: false,
      })

      await bartender.open('modal')
      await bartender.open('nonmodal', true)

      expect(bartender.getOpenBar(true)?.name).toBe('modal')
      expect(bartender.getOpenBar(false)?.name).toBe('nonmodal')

      bartender.destroy()
    })
  })

  describe('removeBar()', () => {
    it('should remove a bar', () => {
      const bartender = new Bartender()
      bartender.addBar('test', { el: createDialog() })
      bartender.removeBar('test')

      expect(bartender.bars).toHaveLength(0)
      expect(bartender.getBar('test')).toBeNull()
    })

    it('should dispatch bartender-bar-removed event', () => {
      const bartender = new Bartender()
      bartender.addBar('test', { el: createDialog() })

      const handler = vi.fn()
      window.addEventListener('bartender-bar-removed', handler)

      bartender.removeBar('test')
      expect(handler).toHaveBeenCalledTimes(1)

      window.removeEventListener('bartender-bar-removed', handler)
      bartender.destroy()
    })

    it('should not remove dialog element from DOM', () => {
      const bartender = new Bartender()
      const dialog = createDialog()
      bartender.addBar('test', { el: dialog })
      bartender.removeBar('test')

      expect(document.body.contains(dialog)).toBe(true)

      bartender.destroy()
    })

    it('should throw on unknown name', () => {
      const bartender = new Bartender()

      expect(() => {
        bartender.removeBar('unknown')
      }).toThrow('was not found')

      bartender.destroy()
    })
  })

  describe('open()', () => {
    it('should open a bar by name', async () => {
      const bartender = new Bartender()
      const bar = bartender.addBar('test', { el: createDialog() })

      await bartender.open('test')
      expect(bar.isOpen()).toBe(true)

      bartender.destroy()
    })

    it('should open a bar by reference', async () => {
      const bartender = new Bartender()
      const bar = bartender.addBar('test', { el: createDialog() })

      await bartender.open(bar)
      expect(bar.isOpen()).toBe(true)

      bartender.destroy()
    })

    it('should throw on unknown bar', async () => {
      const bartender = new Bartender()

      await expect(bartender.open('unknown')).rejects.toThrow('Unknown bar')

      bartender.destroy()
    })

    it('should close other bars by default', async () => {
      const bartender = new Bartender()
      const bar1 = bartender.addBar('bar1', { el: createDialog() })
      bartender.addBar('bar2', { el: createDialog() })

      await bartender.open('bar1')
      await bartender.open('bar2')

      expect(bar1.isOpen()).toBe(false)

      bartender.destroy()
    })

    it('should keep other bars open with keepOtherBarsOpen', async () => {
      const bartender = new Bartender()
      const bar1 = bartender.addBar('bar1', { el: createDialog() })
      bartender.addBar('bar2', { el: createDialog() })

      await bartender.open('bar1')
      await bartender.open('bar2', true)

      expect(bar1.isOpen()).toBe(true)

      bartender.destroy()
    })
  })

  describe('close()', () => {
    it('should close a bar by name', async () => {
      const bartender = new Bartender()
      const bar = bartender.addBar('test', { el: createDialog() })

      await bartender.open('test')
      await bartender.close('test')
      expect(bar.isOpen()).toBe(false)

      bartender.destroy()
    })

    it('should close the topmost bar when no argument given', async () => {
      const bartender = new Bartender()
      const bar1 = bartender.addBar('bar1', { el: createDialog() })
      const bar2 = bartender.addBar('bar2', { el: createDialog() })

      await bartender.open('bar1')
      await bartender.open('bar2', true)
      await bartender.close()

      expect(bar2.isOpen()).toBe(false)
      expect(bar1.isOpen()).toBe(true)

      bartender.destroy()
    })

    it('should return null if no bars are open', async () => {
      const bartender = new Bartender()

      const result = await bartender.close()
      expect(result).toBeNull()

      bartender.destroy()
    })
  })

  describe('toggle()', () => {
    it('should open a closed bar', async () => {
      const bartender = new Bartender()
      const bar = bartender.addBar('test', { el: createDialog() })

      await bartender.toggle('test')
      expect(bar.isOpen()).toBe(true)

      bartender.destroy()
    })

    it('should close an open bar', async () => {
      const bartender = new Bartender()
      const bar = bartender.addBar('test', { el: createDialog() })

      await bartender.open('test')
      await bartender.toggle('test')
      expect(bar.isOpen()).toBe(false)

      bartender.destroy()
    })
  })

  describe('closeAll()', () => {
    it('should close modal bars', async () => {
      const bartender = new Bartender()
      const bar1 = bartender.addBar('bar1', {
        el: createDialog(),
        modal: true,
      })
      const bar2 = bartender.addBar('bar2', {
        el: createDialog(),
        modal: true,
      })

      await bartender.open('bar1')
      await bartender.open('bar2', true)
      await bartender.closeAll()

      expect(bar1.isOpen()).toBe(false)
      expect(bar2.isOpen()).toBe(false)

      bartender.destroy()
    })

    it('should not close non-modal bars by default', async () => {
      const bartender = new Bartender()
      const bar = bartender.addBar('test', {
        el: createDialog(),
        modal: false,
      })

      await bartender.open('test')
      await bartender.closeAll()

      expect(bar.isOpen()).toBe(true)

      bartender.destroy()
    })

    it('should close non-modal bars with closeAll(true)', async () => {
      const bartender = new Bartender()
      const bar = bartender.addBar('test', {
        el: createDialog(),
        modal: false,
      })

      await bartender.open('test')
      await bartender.closeAll(true)

      expect(bar.isOpen()).toBe(false)

      bartender.destroy()
    })
  })

  describe('body classes', () => {
    it('should add bartender-open when a bar is opened', async () => {
      const bartender = new Bartender()
      bartender.addBar('test', { el: createDialog() })

      await bartender.open('test')
      expect(document.body.classList.contains('bartender-open')).toBe(true)

      bartender.destroy()
    })

    it('should remove bartender-open when all bars are closed', async () => {
      const bartender = new Bartender()
      bartender.addBar('test', { el: createDialog() })

      await bartender.open('test')
      await bartender.close('test')
      expect(document.body.classList.contains('bartender-open')).toBe(false)

      bartender.destroy()
    })

    it('should add bartender-disable-scroll when a modal bar is open', async () => {
      const bartender = new Bartender()
      const bar = bartender.addBar('test', { el: createDialog(), modal: true })

      await bartender.open('test')
      expect(
        document.body.classList.contains('bartender-disable-scroll'),
      ).toBe(true)

      await bartender.close('test')
      await waitForEvent(bar.el, 'bartender-bar-after-close')
      bartender.destroy()
    })

    it('should not add bartender-disable-scroll for non-modal bar', async () => {
      const bartender = new Bartender()
      bartender.addBar('test', { el: createDialog(), modal: false })

      await bartender.open('test')

      expect(bartender.openBars).toHaveLength(1)
      expect(bartender.openBars[0].modal).toBe(false)

      // Clear class in case a stale handler from a previous test added it,
      // then open another non-modal bar to verify this bartender doesn't re-add it
      document.body.classList.remove('bartender-disable-scroll')
      bartender.addBar('test2', { el: createDialog(), modal: false })
      await bartender.open('test2', true)
      expect(bartender.openBars.every((b) => b.modal === false)).toBe(true)

      bartender.destroy()
    })
  })

  describe('escape key', () => {
    it('should not close permanent modal bar on escape', async () => {
      const bartender = new Bartender()
      const bar = bartender.addBar('test', {
        el: createDialog(),
        modal: true,
        permanent: true,
      })

      await bartender.open('test')
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      )

      expect(bar.isOpen()).toBe(true)

      bartender.destroy()
    })
  })

  describe('destroy()', () => {
    it('should remove bars', () => {
      const bartender = new Bartender()
      bartender.addBar('test', { el: createDialog() })

      bartender.destroy()
      expect(bartender.bars).toHaveLength(0)
    })

    it('should remove body classes', () => {
      const bartender = new Bartender()
      bartender.destroy()

      expect(document.body.classList.contains('bartender-ready')).toBe(false)
    })

    it('should dispatch bartender-destroyed event', () => {
      const handler = vi.fn()
      window.addEventListener('bartender-destroyed', handler)

      const bartender = new Bartender()
      bartender.destroy()

      expect(handler).toHaveBeenCalledTimes(1)

      window.removeEventListener('bartender-destroyed', handler)
    })
  })
})
