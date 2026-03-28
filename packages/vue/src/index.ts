import { type DirectiveBinding, type Plugin } from 'vue'
import {
  type BartenderOptions,
  type BartenderBarDefaultOptions,
  Bartender,
} from '@fokke-/bartender.js'

import BartenderBar from './lib/components/BartenderBar.vue'
export { BartenderBar }

// Bartender instance
let bartender: Bartender | null = null

export const createBartender = (
  options: BartenderOptions = {},
  barDefaultOptions: BartenderBarDefaultOptions = {},
): Plugin => {
  return {
    install(app) {
      // Create a new instance
      bartender = new Bartender(options, barDefaultOptions)

      // Directive for opening bar
      app.directive('bartender-open', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
          const handler = () => {
            bartender?.open(binding.value, !!binding.modifiers.keep)
          }
          el.addEventListener('click', handler)
          ;(el as any)._bartenderOpenHandler = handler
        },
        unmounted(el: HTMLElement) {
          el.removeEventListener('click', (el as any)._bartenderOpenHandler)
          delete (el as any)._bartenderOpenHandler
        },
      })

      // Directive for toggling bar
      app.directive('bartender-toggle', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
          const handler = () => {
            bartender?.toggle(binding.value, !!binding.modifiers.keep)
          }
          el.addEventListener('click', handler)
          ;(el as any)._bartenderToggleHandler = handler
        },
        unmounted(el: HTMLElement) {
          el.removeEventListener('click', (el as any)._bartenderToggleHandler)
          delete (el as any)._bartenderToggleHandler
        },
      })

      // Directive for closing bar
      app.directive('bartender-close', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
          const handler = () => {
            bartender?.close(binding.value)
          }
          el.addEventListener('click', handler)
          ;(el as any)._bartenderCloseHandler = handler
        },
        unmounted(el: HTMLElement) {
          el.removeEventListener('click', (el as any)._bartenderCloseHandler)
          delete (el as any)._bartenderCloseHandler
        },
      })
    },
  }
}

export const useBartender = (): Bartender | null => {
  if (!bartender) {
    console.error(
      'You must enable Bartender plugin before calling useBartender().',
    )
  }

  return bartender
}
