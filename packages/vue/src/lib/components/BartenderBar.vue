<template>
  <slot name="activator" :open="openThis" :toggle="toggleThis" />
  <dialog ref="dialogEl" v-bind="$attrs">
    <slot
      name="default"
      :open="open"
      :toggle="toggle"
      :close="close"
      :focus="focus"
    />
  </dialog>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import {
  type BartenderBarDefaultOptions,
  type BartenderBar,
  type BartenderBarEvent,
  type BartenderBarUpdatedEvent,
} from '@fokke-/bartender.js'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useBartender } from '../../index'

interface BarComponentProps extends BartenderBarDefaultOptions {
  /** Unique bar name */
  name: string
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<BarComponentProps>(), {
  position: undefined,
  modal: undefined,
  overlay: undefined,
  permanent: undefined,
  scrollTop: undefined,
})

defineSlots<{
  default(_props: {
    /** Open another bar */
    open: typeof open

    /** Toggle another bar */
    toggle: typeof toggle

    /** Close this bar */
    close: typeof close

    /** Focus to this bar */
    focus: typeof focus
  }): any
  activator(_props: {
    /** Open this bar */
    open: typeof openThis

    /** Toggle this bar */
    toggle: typeof toggleThis
  }): any
}>()

const emit = defineEmits<{
  updated: [event: BartenderBarUpdatedEvent]
  'before-open': [event: BartenderBarEvent]
  'after-open': [event: BartenderBarEvent]
  'before-close': [event: BartenderBarEvent]
  'after-close': [event: BartenderBarEvent]
}>()

const bartender = useBartender()
const barInstance = ref<BartenderBar>()
const el = useTemplateRef<HTMLDialogElement>('dialogEl')

/**
 * Open this bar
 */
const openThis = (keepOtherBarsOpen: boolean = false) => {
  if (!bartender) {
    return
  }

  return bartender.open(props.name, keepOtherBarsOpen)
}

/**
 * Open another bar
 */
const open = (
  bar: BartenderBar | string,
  keepOtherBarsOpen: boolean = false,
) => {
  if (!bartender) {
    return
  }

  return bartender.open(bar, keepOtherBarsOpen)
}

/**
 * Toggle this bar
 */
const toggleThis = (keepOtherBarsOpen: boolean = false) => {
  if (!bartender) {
    return
  }

  return bartender.toggle(props.name, keepOtherBarsOpen)
}

/**
 * Toggle another bar
 */
const toggle = (
  bar: BartenderBar | string,
  keepOtherBarsOpen: boolean = false,
) => {
  if (!bartender) {
    return
  }

  return bartender.toggle(bar, keepOtherBarsOpen)
}

/**
 * Close this bar
 */
const close = () => {
  if (!bartender || !barInstance.value) {
    return
  }

  return bartender.close(barInstance.value.name)
}

/**
 * Focus to this bar
 */
const focus = () => {
  el.value?.focus()
}

defineExpose({
  /** Open this bar */
  open: openThis,

  /** Toggle this bar */
  toggle: toggleThis,

  /** Close this bar */
  close,

  /** Focus to this bar */
  focus,
})

onMounted(() => {
  if (!bartender) {
    console.error('You must use Bartender plugin before adding bars.')
    return
  }

  if (!el.value) {
    return
  }

  try {
    barInstance.value = bartender.addBar(props.name, {
      el: el.value,
      ...props,
    })
  } catch (error) {
    console.error(error)
    return
  }

  // Emit library events
  el.value.addEventListener('bartender-bar-updated', (event: Event) => {
    emit('updated', event as BartenderBarUpdatedEvent)
  })
  el.value.addEventListener('bartender-bar-before-open', (event: Event) => {
    emit('before-open', event as BartenderBarEvent)
  })
  el.value.addEventListener('bartender-bar-after-open', (event: Event) => {
    emit('after-open', event as BartenderBarEvent)
  })
  el.value.addEventListener('bartender-bar-before-close', (event: Event) => {
    emit('before-close', event as BartenderBarEvent)
  })
  el.value.addEventListener('bartender-bar-after-close', (event: Event) => {
    emit('after-close', event as BartenderBarEvent)
  })

  // Update bar configuration when props change
  watch(
    () => props.position,
    (val) => {
      if (!barInstance.value || typeof val === 'undefined') {
        return
      }

      barInstance.value.position = val
    },
  )
  watch(
    () => props.modal,
    (val) => {
      if (!barInstance.value || typeof val === 'undefined') {
        return
      }

      barInstance.value.modal = val
    },
  )
  watch(
    () => props.overlay,
    (val) => {
      if (!barInstance.value || typeof val === 'undefined') {
        return
      }

      barInstance.value.overlay = val
    },
  )
  watch(
    () => props.permanent,
    (val) => {
      if (!barInstance.value || typeof val === 'undefined') {
        return
      }

      barInstance.value.permanent = val
    },
  )
  watch(
    () => props.scrollTop,
    (val) => {
      if (!barInstance.value || typeof val === 'undefined') {
        return
      }

      barInstance.value.scrollTop = val
    },
  )
})

onBeforeUnmount(() => {
  if (!bartender || !bartender.getBar(props.name)) {
    return
  }

  bartender.removeBar(props.name)
})
</script>
