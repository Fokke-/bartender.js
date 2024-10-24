# Bartender.js - Accessible off-canvas bars

Bartender is a library for creating accessible off-canvas bars. Any number of bars is supported, and they can be located on any side of the viewport.

Check out the demo in [Bartender.js playground](https://bartender.fokke.fi).

## Features

- Add any number of bars to any side of the viewport
- Bar properties, such as position or mode can be changed on the fly
- Fully stylable
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

Note that it's highly recommended to define the following viewport meta tag to avoid quirks when using bars with `push` mode.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
```

1. Create main wrap for Bartender. Ideally it would be your `<body>` element.
2. Create wrap element for your page content as a direct child of the Bartender main element.
3. Add any number of bar elements as a direct children of the Bartender main element.
4. If you need to use fixed positioned elements in your page content, add them as direct children of the bartender main element.

Note that the class names in the example below are defaults. You can use any classes as they are configurable when you initialize the library later. However, using default classes in addition to your own classes is recommended to avoid FOUC.

```html
<!-- Main wrap for bartender -->
<body class="bartender">

  <!-- Wrap for page content -->
  <div class="bartender__content">
    <button class="toggleMobileNav">Toggle mobile navigation</button>
  </div>

  <!-- Add any number of bars -->
  <dialog class="mobileNav bartender-bar">
    <button class="closeMobileNav">Close mobile navigation</button>
  </dialog>

  <!-- Place your fixed positioned elements here -->

</body>
```

### Include (S)CSS

```scss
@import '@fokke-/bartender.js/dist/bartender.scss';

// ...or

@import '@fokke-/bartender.js/dist/bartender.css';
```

### Initialize the library

```javascript
import { Bartender } from '@fokke-/bartender.js'

// Create main instance
const bartender = new Bartender({
  el: '.bartender',
  contentEl: '.bartender__content',
})

// Add a new bar
bartender.addBar('mobileNav', {
  el: '.mobileNav',
  position: 'left',
  mode: 'float',
})

// Toggle button
document.querySelector('.toggleMobileNav').addEventListener('click', (event) => {
  // Pass button as second argument to return focus after closing the bar.
  bartender.toggle('mobileNav', event.target)
})

// Close button
document.querySelector('.closeMobileNav').addEventListener('click', (event) => {
  bartender.close()
})
```

## Configuration

Bartender constructor accepts two object arguments. The first argument defines main options. The second argument allows you to override [default options for new bars](#bar-options).

```javascript
const bartender = new Bartender({
  // main options
}, {
  // default options for new bars
})
```

### Main Options

#### debug

Type: `boolean`, Default: `false`

If enabled, Bartender will log it's activity to console. Note that these messages will be outputted at debug log level and you need to configure your console to show these messages.

#### el

Type: `string | Element`, Default: `'.bartender'`

Main element as selector string or reference to the element.

#### contentEl

Type: `string | Element`, Default: `'.bartender__content'`

Page content element as selector string or reference to the element.

#### switchTimeout

Type: `number` (milliseconds), Default: `150`

If bar is opened when there's already another active bar, the open bar will be closed and the process will pause for the given time before opening the another bar.

## API

### addBar(name, options)

Add a new bar.

| Argument | Type | Description |
| - | - | - |
| name | string | Unique name for the bar |
| options | object | Bar options. Available options are listed below. |

```javascript
bartender.addBar('mobileNav', {
  el: '.mobileNav',
  position: 'left',
  mode: 'float',
})
```

Bar options can be modified on the fly, except for the `el` property.

```javascript
bartender.getBar('mobileNav').position = 'right'
```

#### Bar options

##### el

Type: `string | Element`

Bar element as selector string or reference to the element.

##### position

Type: `string`, Default: `'left'`

Bar position as string. Possible values are `'left'`, `'right'`, `'top'` and `'bottom'`.

##### mode

Type: `string`, Default: `'float'`

Bar mode as string. Possible values are:

- `float` - The bar will slide in and float over the content.
- `push` - The bar will slide in, and the content wrap will be pushed away from the bar.

##### overlay

Type: `boolean`, Default: `true`

Show shading overlay over content wrap when bar is open. If disabled, overlay element will still be rendered, but it will be transparent.

##### permanent

Type: `boolean`, Default: `false`

If enabled, the bar is not closeable by clicking overlay of pressing `esc` key.

**IMPORTANT:** If you enable this, remember to provide a way to close the bar.

##### scrollTop

Type: `boolean`, Default: `true`

If enabled, bar will be scrolled to top when opening it.

### getBar(name)

Get bar instance by name.

| Argument | Type | Description |
| - | - | - |
| name | string | Bar name |

```javascript
bartender.getBar('mobileNav')
```

### removeBar(name)

Remove bar instance by name.

| Argument | Type | Description |
| - | - | - |
| name | string | Bar name |

```javascript
bartender.removeBar('mobileNav')
```

### open(name)

Open bar by name.

| Argument | Type | Description |
| - | - | - |
| name | string | Bar name |

```javascript
// Open bar 'mobileNav'
bartender.open('mobileNav')
```

### close(name?)

Close bar by name. If name is undefined, any open bar will be closed.

| Argument | Type | Description |
| - | - | - |
| name | string | Bar name |

```javascript
// Close bar 'mobileNav'
bartender.close('mobileNav')

// Close any open bar
bartender.close()
```

### toggle(name)

Toggle bar open/closed state.

| Argument | Type | Description |
| - | - | - |
| name | string | Bar name |

```javascript
// Toggle bar 'mobileNav'
bartender.toggle('mobileNav')
```

### addPushElement(element, options?)

Specify additional element you want to be pushed when bar is opened. This can be useful for fixed elements.

By default element is pushed by all bars, modes and positions, but you can fine-tune this behaviour by options.

| Argument | Type | Description |
| - | - | - |
| el | string \| Element | Element as selector string or reference to the element. |
| options | object | Pushable element options. Available options are listed below. |

```javascript
// Always push the element, regardless of bar configuration
bartender.addPushElement('.myFixedElement')

// Push element only if bar mode is 'push' AND position is 'left' or 'right'.
bartender.addPushElement('.myFixedElement', {
  modes: [
    'push',
  ],
  positions: [
    'left',
    'right',
  ],
})
```

#### Pushable element options

Note that if you specify multiple options, they all have to match to the bar being opened.

##### bars

Type: `Array<Bar>`, Default: `[]`

An array of bar instances.

##### modes

Type: `Array<string>`, Default: `[]`

An array of [bar modes](#mode).

##### positions

Type: `Array<string>`, Default: `[]`

An array of [bar positions](#position).

### removePushElement(el)

Remove pushable element by reference.

| Argument | Type | Description |
| - | - | - |
| el | Element | Reference to the element. |

```javascript
bartender.removePushElement(document.querySelector('.myFixedElement'))
```

### destroy()

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
- mode
- overlay
- permanent
- scrollTop

Bar, updated property name and property value will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-updated', (event) => {
  console.log(`Updated bar '${event.detail.bar.name}' property '${event.detail.property}' to '${event.detail.value}'`)
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

## Styling

Note that all transitions are disabled, if the user prefers reduced motion. [Read more about reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

These css variables will be used as defaults for all transitions:

```css
:root {
  --bartender-transition-duration: 250ms;
  --bartender-transition-timing-function: ease;
}
```

### Bars

Each bar will receive class names based on it's name, position and mode.

```css
/* Styles for all bars */
.bartender__bar {
  background: #dadada;
}

/* Styles for the bar named "mobileNav" */
.bartender__bar--mobileNav {
  background: #dadada;
}

/* Styles for all bars by position */
.bartender__bar--left {
  background: #dadada;
}

/* Styles for all bars by mode */
.bartender__bar--float {
  background: #dadada;
}
```

### Overlay shading

Use `::backdrop` pseudo element to define styles for bar overlays.

```css
/* Styles for all overlays */
.bartender__bar::backdrop {
  background-color: maroon;
}

/* Styles for the overlay of bar named "mobileNav" */
.bartender__bar--mobileNav::backdrop {
  background-color: teal;
}
```
