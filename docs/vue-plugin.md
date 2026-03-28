# Vue plugin

This package contains Vue 3 plugin, providing an easy way to use the library in your Vue application.

- Add bars using `<BartenderBar>` component
- Interact with the library with [directives](#directives) or [scoped slots](#slots)
- Full access to the API via composable

## Requirements

- vue >=3.5.0
- @fokke-/bartender.js >=3.0.0

## Installation

```console
npm i @fokke-/vue-bartender.js
```

### Add the plugin

You need to enable the plugin to initialize the library and set up the directives.

Pass [main options](/main-instance#main-options) and [default options for new bars](/main-instance#default-options-for-new-bars) as arguments to the `createBartender()` function.

```js
// In entry file (e.g. main.js)
import { createBartender } from '@fokke-/vue-bartender.js'
import '@fokke-/bartender.js/dist/bartender.css'

const bartender = createBartender(
  {
    // Main options
  },
  {
    // Default options for new bars
  },
)

app.use(bartender)
```

### Example markup

```html
<template>
  <button v-bartender-open="'mobileNav'">Open mobile navigation</button>

  <!-- Add any number of bars -->
  <BartenderBar name="mobileNav" position="left">
    <button v-bartender-close>Close mobile navigation</button>
  </BartenderBar>
</template>

<script setup>
  import { BartenderBar } from '@fokke-/vue-bartender.js'
</script>
```

## Bar component

### Props

Define [bar options](/adding-a-new-bar#bar-options) as props.

```html
<BartenderBar
  name="mobileNav"
  position="left"
  :overlay="true"
  :permanent="false"
  :scrollTop="true"
>
  <p>Hello world!</p>
</BartenderBar>
```

### Emits

| Event        | Value                             |
| ------------ | --------------------------------- |
| updated      | `event: BartenderBarUpdatedEvent` |
| before-open  | `event: BartenderBarEvent`        |
| after-open   | `event: BartenderBarEvent`        |
| before-close | `event: BartenderBarEvent`        |
| after-close  | `event: BartenderBarEvent`        |

```html
<BartenderBar
  name="mobileNav"
  @updated="(event) => console.log(event)"
  @before-open="(event) => console.log(event)"
  @after-open="(event) => console.log(event)"
  @before-close="(event) => console.log(event)"
  @after-close="(event) => console.log(event)"
>
  <p>Hello world!</p>
</BartenderBar>
```

### Slots

#### \#default

Default slot for bar content.

| Binding    | Description                                        |
| ---------- | -------------------------------------------------- |
| `open()`   | Open another bar by calling `Bartender.open()`     |
| `toggle()` | Toggle another bar by calling `Bartender.toggle()` |
| `close()`  | Close this bar                                     |
| `focus()`  | Focus to this bar                                  |

```html
<BartenderBar name="mobileNav">
  <template #default="{open, toggle, close, focus}">
    <button type="button" @click="open('anotherBar')">Open another</button>
    <button type="button" @click="toggle('anotherBar')">Toggle another</button>
    <button type="button" @click="close()">Close this bar</button>
    <button type="button" @click="focus()">Focus to this bar</button>
  </template>
</BartenderBar>
```

#### \#activator <Badge type="tip" text="1.1+" />

Contents of this slot will be rendered outside the bar.
You can use this slot to render a button that is used to open the bar.

| Binding    | Description     |
| ---------- | --------------- |
| `open()`   | Open this bar   |
| `toggle()` | Toggle this bar |

```html
<BartenderBar name="myDialog" position="center">
  <template #activator="{ open }">
    <button type="button" @click="open()">Open dialog</button>
  </template>
  <template #default>
    <p>Hello!</p>
  </template>
</BartenderBar>
```

### Exposes

| Property   | Description       |
| ---------- | ----------------- |
| `open()`   | Open this bar     |
| `toggle()` | Toggle this bar   |
| `close()`  | Close this bar    |
| `focus()`  | Focus to this bar |

```html
<BartenderBar ref="mobileNav" name="mobileNav">
  <p>Hello world!</p>
</BartenderBar>

<script setup>
  import { useTemplateRef } from 'vue'
  import { BartenderBar } from '@fokke-/vue-bartender.js'

  const mobileNav = useTemplateRef('mobileNav')

  const openMobileNav = () => {
    mobileNav.value?.open()
  }

  const closeMobileNav = () => {
    mobileNav.value?.close()
  }
</script>
```

## Directives

### v-bartender-open

Open bar by name.

```html
<!-- Open bar and close other bars -->
<button v-bartender-open="'mobileNav'">Open mobile navigation</button>

<!-- Open bar, but keep the other bars open -->
<button v-bartender-open.keep="'mobileNav'">Open mobile navigation</button>
```

### v-bartender-toggle

Toggle bar open/closed state.

```html
<!-- Toggle bar and close other bars -->
<button v-bartender-toggle="'mobileNav'">Toggle mobile navigation</button>

<!-- Toggle bar, but keep the other bars open -->
<button v-bartender-toggle.keep="'mobileNav'">Toggle mobile navigation</button>
```

### v-bartender-close

Close bar by name. If name is undefined, the topmost bar will be closed.

```html
<!-- Close mobile navigation -->
<button v-bartender-close="'mobileNav'">Close mobile navigation</button>

<!-- Close any open bar -->
<button v-bartender-close>Close any open bar</button>
```

## Accessing Bartender instance

If you need to access main instance, you can use `useBartender()` to retrieve it.

```javascript
import { useBartender } from '@fokke-/vue-bartender.js'

const bartender = useBartender()
```
