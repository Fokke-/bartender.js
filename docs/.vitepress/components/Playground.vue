<template>
  <BartenderBar
    v-for="(bar, index) of bars"
    :key="bar.name"
    :name="bar.name"
    :position="bar.position"
    :modal="bar.modal"
    :overlay="bar.overlay"
    :permanent="bar.permanent"
    :scrollTop="bar.scrollTop"
  >
    <template #default="{ open, close }">
      <h2>
        <template v-if="bar.title">
          {{ bar.title }}
        </template>
        <template v-else> Bar '{{ bar.name }}' </template>
      </h2>

      <VPButton
        class="bartender-bar__close-button"
        type="button"
        size="medium"
        text="Close"
        @click="close"
      />

      <BarConfig v-if="props.edit === true" v-model="bars[index]" />
      <template v-if="props.switch === true">
        <h3>Switch to another bar</h3>

        <div class="playground-button-list">
          <VPButton
            ref="currentBarButton"
            v-for="bar of bars.filter((item) => item.name !== bar.name)"
            :key="bar.name"
            type="button"
            size="medium"
            :text="`Open '${bar.name}'`"
            @click="open(bar.name, keepOtherBarsOpen)"
          />
        </div>
      </template>
    </template>
  </BartenderBar>
  <div
    :class="[
      'playground',
      props.fullWidth === true ? 'playground--full-width' : undefined,
    ]"
  >
    <h2 v-if="props.title" class="playground__title">{{ props.title }}</h2>
    <div class="playground__wrap">
      <div v-if="props.create === true" class="playground__col">
        <h2>Create a new bar</h2>
        <form @submit.prevent="barFormSubmit" class="playground-form">
          <div class="playground-field">
            <label :for="`bar-name`" class="playground-label">Bar name</label>
            <input
              v-model="newBarData.name"
              class="playground-input playground-input--text"
              id="bar-name"
              type="text"
              required
              pattern="[a-zA-Z]+"
            />
            <p class="playground-field__description">Letters only!</p>
          </div>
          <BarConfig v-model="newBarData" />
          <div class="playground-field">
            <VPButton type="submit" size="medium" text="Create a new bar" />
          </div>
        </form>
      </div>
      <div class="playground-bar-create__col">
        <h2 v-if="props.create === true">Current bars</h2>

        <div class="playground-button-list">
          <VPButton
            ref="currentBarButton"
            v-for="bar of bars"
            :key="bar.name"
            type="button"
            size="medium"
            :text="bar.title || `Open '${bar.name}'`"
            v-bartender-open="bar.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bar } from '../types.d'
import { ref, useTemplateRef, nextTick, onMounted } from 'vue'
import { barDefaultOptions } from '../lib/utils'
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    create?: boolean
    edit?: boolean
    switch?: boolean
    fullWidth?: boolean
    assembly?: 'default' | 'fullScreenBar'
  }>(),
  {
    title: undefined,
    create: false,
    edit: false,
    switch: false,
    fullWidth: false,
    assembly: 'default',
  },
)

const newBarDefaults: Bar = {
  name: '',
  ...barDefaultOptions,
}

const bars = ref<Bar[]>([])

const newBarData = ref<Bar>({
  ...newBarDefaults,
})

const keepOtherBarsOpen = ref<boolean>(false)

const currentBarButtons =
  useTemplateRef<InstanceType<typeof VPButton>[]>('currentBarButton')

const createBar = (data: Bar) => {
  bars.value.push({
    ...newBarDefaults,
    ...data,
  })
}

const barFormSubmit = async () => {
  newBarData.value.name = newBarData.value.name.trim()

  if (!newBarData.value.name) {
    return
  }

  if (bars.value.some((bar) => bar.name === newBarData.value.name)) {
    alert(`Name "${newBarData.value.name}" is already in use.`)
    return
  }

  createBar(newBarData.value)
  newBarData.value = { name: '', ...barDefaultOptions }

  await nextTick()

  currentBarButtons.value[currentBarButtons.value.length - 1].$el.focus()
}

onMounted(() => {
  switch (props.assembly) {
    case 'fullScreenBar': {
      createBar({
        name: 'first',
        title: 'Full screen bar',
        position: 'left',
      })

      break
    }

    default: {
      createBar({
        name: 'first',
        position: 'left',
      })

      createBar({
        name: 'second',
        position: 'right',
      })

      break
    }
  }
})
</script>

<style>
.playground {
  container-type: inline-size;
  margin: 48px 0;
}

.playground__title {
  flex: 0 0 100%;
  text-align: center;
}

.playground--full-width {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 48px 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.playground__wrap {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 2rem;
}

@container (min-width: 500px) {
  .playground__wrap {
    flex-direction: row;
  }
}

.playground__col {
  flex: 0 0 50%;
}

.playground h2 {
  border: 0;
  margin: 0 0 1em 0;
  padding-top: 0;
}

.playground-fieldset:first-child,
.playground-field:first-child {
  margin-top: 0;
}

.playground-fieldset {
  margin-top: 1.5rem;
  border-color: var(--vp-local-search-result-border);
}

.playground-fieldset__legend {
  margin-left: 1rem;
}

.playground-fieldset__content {
  padding: 1rem;
}

.playground-field {
  margin-top: 1.5rem;
}

.playground-field--radio,
.playground-field--checkbox {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  margin-top: 0.75rem;
}

.playground-field__description {
  font-size: 0.85em;
  margin: 0 !important;
}

.playground-label {
  /* font-weight: bold; */
  display: block;
}

.playground-input--text {
  display: block;
  width: 100%;
  padding: 0.75em;
  font-size: 16px;
  line-height: 1;
  border: solid 1px var(--vp-local-search-result-border);
  border-radius: 8px;
}

.playground-input--text:hover {
  border-color: var(--vp-button-brand-hover-bg);
}

.playground-input--text:focus {
  border-color: var(--vp-button-brand-active-bg);
}

.playground-input--radio,
.playground-input--checkbox {
  margin: 0 0.5em 0 0;
  accent-color: var(--vp-button-brand-bg);
}

.playground-input--radio:focus-visible,
.playground-input--checkbox:focus-visible {
  outline: solid 1px var(--vp-button-brand-active-bg);
  outline-offset: 3px;
}

.playground-button-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
