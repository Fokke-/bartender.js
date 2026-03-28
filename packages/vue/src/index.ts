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
          el.addEventListener('click', () => {
            bartender?.open(binding.value, !!binding.modifiers.keep)
          })
        },
      })

      // Directive for toggling bar
      app.directive('bartender-toggle', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
          el.addEventListener('click', () => {
            bartender?.toggle(binding.value, !!binding.modifiers.keep)
          })
        },
      })

      // Directive for closing bar
      app.directive('bartender-close', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
          el.addEventListener('click', () => {
            bartender?.close(binding.value)
          })
        },
      })
    },
  }
}

export const useBartender = () => {
  if (!bartender) {
    console.error(
      'You must enable Bartender plugin before calling useBartender().',
    )
  }

  return bartender
}
