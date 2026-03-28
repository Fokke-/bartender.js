<template>
  <fieldset class="playground-fieldset">
    <legend class="playground-fieldset__legend">Position</legend>
    <div class="playground-fieldset__content">
      <div
        v-for="option of barPositions"
        :key="option.value"
        class="playground-field playground-field--radio"
      >
        <input
          :id="`${modelValue.name}-position-${option.value}`"
          class="playground-input playground-input--radio"
          v-model="modelValue.position"
          type="radio"
          :name="`${modelValue.name}-position`"
          :value="option.value"
        />
        <label
          class="playground-check-label"
          :for="`${modelValue.name}-position-${option.value}`"
        >
          {{ option.label }}
        </label>
      </div>
    </div>
  </fieldset>
  <fieldset class="playground-fieldset">
    <legend class="playground-fieldset__legend">Options</legend>
    <div class="playground-fieldset__content">
      <div class="playground-field playground-field--checkbox">
        <input
          :id="`${modelValue.name}-overlay`"
          class="playground-input playground-input--checkbox"
          v-model="modelValue.overlay"
          type="checkbox"
          name="overlay"
        />
        <label
          class="playground-check-label"
          :for="`${modelValue.name}-overlay`"
        >
          Overlay
        </label>
      </div>
      <div class="playground-field playground-field--checkbox">
        <input
          :id="`${modelValue.name}-permanent`"
          class="playground-input playground-input--checkbox"
          v-model="modelValue.permanent"
          type="checkbox"
          name="permanent"
        />
        <label
          class="playground-check-label"
          :for="`${modelValue.name}-permanent`"
        >
          Permanent
        </label>
      </div>
      <div class="playground-field playground-field--checkbox">
        <input
          :id="`${modelValue.name}-scrollTop`"
          class="playground-input playground-input--checkbox"
          v-model="modelValue.scrollTop"
          type="checkbox"
          name="scrollTop"
        />
        <label
          class="playground-check-label"
          :for="`${modelValue.name}-scrollTop`"
        >
          Scroll to the top
        </label>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import type { BartenderBarPosition } from '@fokke-/bartender.js'
import type { Bar } from '../types.d'
import { ref } from 'vue'
import { barDefaultOptions } from '../lib/utils'

interface BarPosition {
  label: string
  value: BartenderBarPosition
}

const barPositions = ref<BarPosition[]>([
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Center', value: 'center' },
])

const modelValue = defineModel<Bar>({
  default: () => ({
    name: '',
    ...barDefaultOptions,
  }),
})
</script>
