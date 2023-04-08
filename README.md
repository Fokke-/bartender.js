# Bartender.js - Accessible off-canvas bars

Bartender is a library for creating accessible off-canvas bars. Any number of bars are supported, and they can be located on any side of the viewport.

The following accessibility concerns have been taken into account:

- ARIA-attributes are being used for all relevant elements
- After closing the bar the focus will return to the button which was used to open the bar
- If focus trap is enabled and bar is open, only it's child elements are focusable
- If focus trap is enabled and bar is closed, it's child elements are not focusable
- All transitions are disabled if user prefers reduced motion

## Browser support

All major browsers are supported. Library is transpiled to ES2015.

## Installation

```console
npm i @fokke-/bartender.js
```

## Minimal example

### Markup

Note that it's highly recommended to define viewport meta tag to avoid quirks when using bars with `push` or `reveal` modes.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
```

1. Create main wrap for Bartender. Ideally it would be your `<body>` element, but `<div>` elements are fine too.
2. Create wrap element for your page content as a direct child of the Bartender main element.
3. Create any number of bar elements as a direct children of the Bartender main element.
4. Optional: if you need to use fixed positioned elements in your page content, add container element as a direct child of the bartender main element.

Note that the class names in the example below are defaults. You can use any classes as they are configurable when you initialize the library later.

```html
<!-- Main wrap for bartender -->
<body class="bartender">

  <!-- Wrap for page content -->
  <div class="bartender__content">
    <button class="toggleMobileNav">Toggle mobile navigation</button>
  </div>

  <!-- Add any number of bars -->
  <div class="mobileNav bartender__bar">
    <button class="closeMobileNav">Close mobile navigation</button>
  </div>

  <!-- Optionally add container for fixed positioned elements. -->
  <div class="bartender__fixed">
    <!-- Place your fixed positioned elements here -->
  </div>

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
import Bartender from '@fokke-/bartender.js'

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
});
```

### Main Options

#### debug

Type: `boolean`, Default: `false`

If enabled, Bartender will log it's activity to console. Note that these messages will be outputted at debug log level and you need to configure your console to show these messages.

#### el

Type: `string | Element`, Default: `'.bartender'`

Specify main element as selector string or reference to the element.

#### contentEl

Type: `string | Element`, Default: `'.bartender__content'`

Specify page content element as selector string or reference to the element.

#### fixed

Type: `string | Element`, Default: `'.bartender__fixed'`

Specify fixed element container as selector string or reference to the element. Fixed elements as direct children of main element will work, but using a container is required if you enable focus trap.

#### switchTimeout

Type: `number` (milliseconds), Default: `150`

If bar is opened when there's already another active bar, the open bar will be closed and the library will pause for the given time before opening the another bar.

#### focusTrap

Type: `boolean`, Default: `false`

If enabled, keyboard focus will be trapped either to the page content or to the currently open bar.

**IMPORTANT:** If you enable this, you **must** provide a way to close the bar with keyboard. Even though by default `esc` key closes the bar, adding a dedicated close button to the bar is highly recommended.

## API

### destroy()

Destroy Bartender instance.

```javascript
bartender.destroy()
```

### getBar(name)

Get bar instance by name.

| Argument | Type | Description |
| - | - | - |
| name | string | Bar name |

```javascript
bartender.getBar('mobileNav')
```

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

#### Bar options

##### el

Type: `string | Element`

Specify element as selector string or reference to the element.

##### position

Type: `string`, Default: `'left'`

Specify bar position as string. Possible values are `'left'`, `'right'`, `'top'` and `'bottom'`.

##### mode

Type: `string`, Default: `'float'`

Specify bar mode as string. Possible values are:

- `float` - The bar will slide in and float over the content.
- `push` - The bar will slide in, and the content wrap will be pushed away from the bar.
- `reveal` - Content wrap will be pushed away, revealing the bar underneath

##### overlay

Type: `boolean`, Default: `true`

Show shading overlay over content wrap when bar is open.

##### permanent

Type: `boolean`, Default: `false`

If enabled, the bar is not closable by clicking overlay of pressing `esc` key.

**IMPORTANT:** If you enable this, remember to provide a way to close the bar.

##### scrollTop

Type: `boolean`, Default: `true`

If enabled, bar will be scrolled to top when opening it.

### removeBar(name)

Remove bar instance by name.

| Argument | Type | Description |
| - | - | - |
| name | string | Bar name |

```javascript
bartender.removeBar('mobileNav')
```

### open(name, button?)

Open bar by name. If you specify reference to the element as a second argument, the focus will be returned to given element after bar is closed.

| Argument | Type | Description |
| - | - | - |
| name | string | Bar name |
| button | HTMLElement | Optional reference to the button |

```javascript
const button = document.querySelector('.toggleMobileNav')

bartender.open('mobileNav', button)
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

### toggle (name, button?)

Toggle bar open/closed state. If you specify reference to the element as a second argument, the focus will be returned to given element after bar is closed.

| Argument | Type | Description |
| - | - | - |
| name | string | Bar name |
| button | HTMLElement | Optional reference to the button |

```javascript
const button = document.querySelector('.toggleMobileNav')

bartender.toggle('mobileNav', button)
```

### addPushElement (element, options?)

Specify additional element you want to be pushed when bar is opened. This can be useful for fixed elements placed in fixed element container.

By default element is pushed by all bars, modes and positions, but you can fine-tune this behaviour by options.

| Argument | Type | Description |
| - | - | - |
| el | string \| element | Element as selector string or reference to the element. |
| options | object | Pushable element options. Available options are listed below. |

```javascript
// Push element only if mode is 'push' or 'reveal' AND position is 'left' or 'right'.
bartender.addPushElement('.myFixedElement', {
  modes: [
    'push',
    'reveal',
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

Type: `Array<string>`, Default: `[]`

An array of bar names.

##### modes

Type: `Array<string>`, Default: `[]`

An array of [bar modes](#mode).

##### positions

Type: `Array<string>`, Default: `[]`

An array of [bar positions](#position).

### removePushElement (el)

Remove pushable element by reference.

| Argument | Type | Description |
| - | - | - |
| el | element | Reference to the element. |

```javascript
bartender.removePushElement(document.querySelector('.myFixedElement'))
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

```javascript
window.addEventListener('bartender-bar-updated', (event) => {
  console.log(event.detail.bar)
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
