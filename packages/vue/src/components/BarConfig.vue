<template>
  <form @submit.prevent="barFormSubmit">
    <div v-if="props.editMode === false" class="field">
      <label :for="`${barName}-name`" class="label"> Name </label>
      <div class="field__content">
        <input
          v-model="nameValue"
          :id="`${barName}-name`"
          type="text"
          required
          pattern="[a-zA-Z]+"
        />
        <p class="field__description">Letters only!</p>
      </div>
    </div>
    <fieldset>
      <legend>Position</legend>
      <div>
        <div class="field">
          <div v-for="item of barPositions" :key="item.value" class="radio">
            <input
              class="radio__input"
              v-model="optionsValue.position"
              type="radio"
              name="position"
              :value="item.value"
              :id="`${barName}-position-${item.value}`"
            />
            <label
              class="radio__label"
              :for="`${barName}-position-${item.value}`"
            >
              {{ item.label }}
            </label>
          </div>
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>Settings</legend>
      <div>
        <div class="field">
          <div v-for="item of barSettings" :key="item.value" class="checkbox">
            <input
              class="checkbox__input"
              v-model="optionsValue[item.value as keyof typeof optionsValue]"
              type="checkbox"
              name="settings"
              :id="`${barName}-setting-${item.value}`"
            />
            <label
              class="checkbox__label"
              :for="`${barName}-setting-${item.value}`"
            >
              {{ item.label }}
            </label>
          </div>
        </div>
      </div>
    </fieldset>
    <div class="buttons">
      <button v-if="props.editMode === false" type="submit">Create</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { BartenderBarOptions } from '@fokke-/bartender.js'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name?: string
    options?: BartenderBarOptions
    editMode?: boolean
  }>(),
  {
    name: '',
    options: () => {
      return {}
    },
    editMode: false,
  },
)

const emit = defineEmits(['update:name', 'update:options', 'submit'])

const barPositions = [
  {
    label: 'Left',
    value: 'left',
  },
  {
    label: 'Right',
    value: 'right',
  },
  {
    label: 'Top',
    value: 'top',
  },
  {
    label: 'Bottom',
    value: 'bottom',
  },
  {
    label: 'Center',
    value: 'center',
  },
]

const barSettings = [
  {
    label: 'Overlay',
    value: 'overlay',
  },
  {
    label: 'Permanent',
    value: 'permanent',
  },
  {
    label: 'Scroll to top after opening',
    value: 'scrollTop',
  },
]

const nameValue = computed({
  get() {
    return props.name
  },
  set(value) {
    emit('update:name', value)
  },
})

const optionsValue = computed({
  get() {
    return props.options
  },
  set(value) {
    emit('update:options', value)
  },
})

const barName = computed(() => {
  return props.name || 'newBar'
})

const barFormSubmit = () => {
  if (props.editMode === true) {
    return
  }

  emit('submit')
}
</script>
