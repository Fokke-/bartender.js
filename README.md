# Bartender.js - Accessible off-canvas bars

Bartender is a library for creating accessible off-canvas bars. Any number of bars is supported, and they can be located on any side of the viewport.

Check out the demo in [Bartender.js playground](https://bartender.fokke.fi).

## Features

- Add any number of bars to any side of the viewport
- Multiple bars can be open simultaneously
- Bar properties, such as position can be changed on the fly
- TypeScript is supported
- Comprehesive API, integrable to frameworks

## Accessibility

- The library uses [\<dialog\> elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) for bars, providing native focus trap, focus return etc.
- All transitions are disabled if user prefers reduced motion

**IMPORTANT**: when the bar is open, focus is trapped in the bar. It's highly recommended to provide users with a way to close the bar with a keyboard. Even though by default the bar is closeable by hitting the `esc` key, adding a dedicated close button is recommended. This holds especially true for permanent bars, which are not closeable by hitting `esc` or clicking outside the bar.

## Browser requirements

- [\<dialog\> element](https://caniuse.com/dialog) must be supported
- (optional) [transition-behavior: allow-discrete](https://caniuse.com/mdn-css_properties_content-visibility_transitionable) must be supported to enable bar transitions.

If you need to support older browsers, use version 2.x.

## Installation

```console
npm i @fokke-/bartender.js
```

## Quick start

### Markup

```html
<html lang="en">
  <head>
    <!-- Note that it's highly recommended to define the following viewport meta tag -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
    />
  </head>
  <body>
    <!-- Button for opening the bar -->
    <button class="openMobileNav">Open mobile navigation</button>

    <!-- Add any number of bars as dialog elements -->
    <dialog class="mobileNav">
      <button class="closeMobileNav">Close mobile navigation</button>
    </dialog>
  </body>
</html>
```

### Include CSS

```scss
@import '@fokke-/bartender.js/dist/bartender.scss';

// ...or

@import '@fokke-/bartender.js/dist/bartender.css';
```

### Initialize the library

```javascript
import { Bartender } from '@fokke-/bartender.js'

// Create main instance
const bartender = new Bartender()

// Add a new bar
bartender.addBar('mobileNav', {
  el: '.mobileNav',
  position: 'left',
})

// Handle open button
document.querySelector('.openMobileNav').addEventListener('click', (event) => {
  bartender.open('mobileNav')
})

// Handle close button
document.querySelector('.closeMobileNav').addEventListener('click', (event) => {
  bartender.close()
})
```

## API

### Bartender.constructor(options: BartenderOptions = {}, barDefaultOptions: BartenderBarDefaultOptions = {})

#### Interface BartenderOptions

| Property | Type    | Default | Description                                                                 |
| -------- | ------- | ------- | --------------------------------------------------------------------------- |
| debug    | boolean | false   | If enabled, Bartender will log it's activity to console at debug log level. |

#### Interface BartenderBarOptions

| Property  | Type                                   | Default | Description                                                     |
| --------- | -------------------------------------- | ------- | --------------------------------------------------------------- |
| el        | string \| element                      |         | Bar element as selector string or reference to the element.     |
| position  | 'left' \| 'right' \| 'top' \| 'bottom' | 'left'  | Bar position                                                    |
| overlay   | boolean                                | true    | Show shading overlay over content wrap when bar is open.        |
| permanent | boolean                                | false   | Bar is not closeable by clicking overlay of pressing `esc` key. |
| scrollTop | boolean                                | true    | Bar will be scrolled to top after opening it.                   |

```javascript
const bartender = new Bartender(
  {
    debug: true,
  },
  {
    // default options for new bars
  },
)
```

### Bartender.getBar(name: string): BartenderBar | null

Get bar instance by name.

| Argument | Type   | Default | Description |
| -------- | ------ | ------- | ----------- |
| name     | string |         | Bar name    |

```javascript
bartender.getBar('mobileNav')
```

### Bartender.getOpenBar(): BartenderBar | null

Get the topmost open bar instance

```javascript
bartender.getOpenBar()
```

### Bartender.addBar(name: string, options: BartenderBarOptions = {}): BartenderBar

Add a new bar.

| Argument | Type                | Default | Description                                   |
| -------- | ------------------- | ------- | --------------------------------------------- |
| name     | string              |         | Unique name for the bar                       |
| options  | BartenderBarOptions | {}      | [Bar options](#interface-bartenderbaroptions) |

```javascript
bartender.addBar('mobileNav', {
  el: '.mobileNav',
  position: 'left',
})
```

Bar options can be modified on the fly, except for the `el` property.

```javascript
bartender.getBar('mobileNav').position = 'right'
```

### Bartender.removeBar(name: string): this

Remove bar instance by name.

| Argument | Type   | Default | Description |
| -------- | ------ | ------- | ----------- |
| name     | string |         | Bar name    |

```javascript
bartender.removeBar('mobileNav')
```

### async Bartender.open(bar: BartenderBar | string, options: BartenderOpenOptions = {}): Promise\<BartenderBar\>

Open bar. Resolves after bar has opened.

| Argument | Type                   | Default | Description                                           |
| -------- | ---------------------- | ------- | ----------------------------------------------------- |
| bar      | BartenderBar \| string |         | Bar instance or name                                  |
| options  | BartenderOpenOptions   | {}      | [Additional options](#interface-bartenderopenoptions) |

#### Interface BartenderOpenOptions

Bar can be opened as a modal (default) or as a standard dialog.

**In modal mode** focus will be trapped to the bar and interaction with elements outside the bar will be disabled.

**In standard dialog mode** bar will open as a fixed element and interaction with elements outside the bar is allowed. This mode can be useful if you plan to keep the bar as a permanent component of your layout. Note that in standard dialog mode the following exceptions will take place:

- Overlay shading will not be rendered.
- Bar is not closeable by hitting `esc` key, regardless of the `permanent` setting of the bar.
- Bar will not be closed when another bar is opened with `closeOtherBars: true`.
- Bar will not be closed when `Bartender.closeAll()` is called without any arguments.

| Property       | Type    | Default | Description        |
| -------------- | ------- | ------- | ------------------ |
| closeOtherBars | boolean | true    | Close other bars?  |
| modal          | boolean | true    | Open bar as modal? |

```javascript
// Open bar with default options, as modal
bartender.open('mobileNav')

// Open bar as a standard dialog
bartender.open('mobileNav', {
  modal: false,
})
```

### async Bartender.close(bar?: BartenderBar | string): Promise<BartenderBar | null>

Close bar. If bar is undefined, the topmost bar will be closed. Resolves after the bar has closed.

| Argument | Type                                | Default | Description          |
| -------- | ----------------------------------- | ------- | -------------------- |
| bar      | BartenderBar \| string \| undefined |         | Bar instance or name |

```javascript
// Close bar 'mobileNav'
bartender.close('mobileNav')

// Close the topmost open bar
bartender.close()
```

### async Bartender.closeAll(closeNonModalBars: boolean = false): Promise<this>

Close all bars. Resolves after all the bars have been closed.

| Argument          | Type    | Default | Description                                         |
| ----------------- | ------- | ------- | --------------------------------------------------- |
| closeNonModalBars | boolean | false   | Close non-modal bars in addition to the modal bars? |

```javascript
// Close all non-modal bars
bartender.closeAll()

// Close all bars, including the non-modal
bartender.closeAll(true)
```

### async Bartender.toggle(bar?: BartenderBar | string, options: BartenderOpenOptions = {}): Promise<BartenderBar | null>

Toggle bar open/closed state. Resolves after the bar has opened or closed.

| Argument | Type                   | Default | Description                                           |
| -------- | ---------------------- | ------- | ----------------------------------------------------- |
| bar      | BartenderBar \| string |         | Bar instance or name                                  |
| options  | BartenderOpenOptions   | {}      | [Additional options](#interface-bartenderopenoptions) |

```javascript
// Toggle bar with default options, as modal
bartender.toggle('mobileNav')

// Toggle bar as a standard dialog
bartender.toggle('mobileNav', {
  modal: false,
})
```

### Bartender.destroy(): this

Destroy Bartender instance.

```javascript
bartender.destroy()
```

## Events

### bartender-init

Bartender has been initialized. Instance will be included in `detail` object.

```javascript
window.addEventListener('bartender-init', (event) => {
  console.log(event.detail.bartender)
})
```

### bartender-destroyed

Bartender instance has been destroyed. Instance will be included in `detail` object.

```javascript
window.addEventListener('bartender-destroyed', (event) => {
  console.log(event.detail.bartender)
})
```

### bartender-bar-added

A new bar has been added. Bar will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-added', (event) => {
  console.log(event.detail.bar)
})
```

### bartender-bar-removed

A bar has been removed. Bar name will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-removed', (event) => {
  console.log(event.detail.name)
})
```

### bartender-bar-updated

This event is dispatched when one of the following bar properties change:

- position
- overlay
- permanent
- scrollTop

Bar, updated property name and property value will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-updated', (event) => {
  console.log(
    `Updated bar '${event.detail.bar.name}' property '${event.detail.property}' to '${event.detail.value}'`,
  )
})
```

### bartender-bar-before-open

Bar has started to open. Bar will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-before-open', (event) => {
  console.log(event.detail.bar)
})
```

### bartender-bar-after-open

Bar is open. Bar will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-after-open', (event) => {
  console.log(event.detail.bar)
})
```

### bartender-bar-before-close

Bar has started to close. Bar will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-before-close', (event) => {
  console.log(event.detail.bar)
})
```

### bartender-bar-after-close

Bar is closed. Bar will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-after-close', (event) => {
  console.log(event.detail.bar)
})
```
