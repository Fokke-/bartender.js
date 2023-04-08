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
  <!-- <div class="bartender__fixedElementContainer"></div> -->

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

Bartender constructor accepts two object arguments. The first argument defines main options and the second argument defines default options for new bars.

```javascript
const bartender = new Bartender({
  // main options
}, {
  // default options for new bars
});
```

TODO: mention bar default options

| Property | Type | Default | Description
| ------------- | ------------- | ------------- | ------------- |
| debug  | boolean | false | If enabled, Bartender will log it's activity to console. Note that these messages will be outputted at debug log level and you need to configure your console to show these messages.
| el  | string \| Element | .bartender | Main element as selector string or reference to the element.
| contentEl  | string \| Element | .bartender__content | Page content element as selector string or reference to the element.
| fixedElementContainer  | string \| Element | .bartender__fixedElementContainer | Fixed element container as selector string or reference to the element. Fixed elements as direct children of main element will work, but using a container is required if you enable focus trap.
| switchTimeout  | number | 150 | If bar is opened when there's already another active bar, the open bar will be closed and the library will pause for the given time before opening the another bar.
| focusTrap  | boolean | false | If enabled, keyboard focus will be trapped either to the page content or to the currently open bar. **IMPORTANT:** If you enable this, you **must** provide a way to close the bar with keyboard. Even though by default `esc` key closes the bar, adding a dedicated close button to the bar is highly recommended.


#### debug

Type: `boolean`, Default: `false`

If enabled, Bartender will log it's activity to console. Note that these messages will be outputted at debug log level and you need to configure your console to show these messages.

#### el

Type: `string | Element`, Default: `.bartender`

Specify main element as selector string or reference to the element.

#### contentEl

Type: `string | Element`, Default: `.bartender__content`

Specify page content element as selector string or reference to the element.

#### fixedElementContainer

Type: `string | Element`, Default: `.bartender__fixedElementContainer`

Specify fixed element container as selector string or reference to the element. Fixed elements as direct children of main element will work, but using a container is required if you enable focus trap.

#### switchTimeout

Type: `number` (milliseconds), Default: `150`

If bar is opened when there's already another active bar, the open bar will be closed and the library will pause for the given time before opening the another bar.

#### focusTrap

Type: `boolean`, Default: `false`

If enabled, keyboard focus will be trapped either to the page content or to the currently open bar. **IMPORTANT:** If you enable this, you **must** provide a way to close the bar with keyboard. Even though by default `esc` key closes the bar, adding a dedicated close button to the bar is highly recommended.

### Default options for new bars

#### position

Type: `string`, Default: `left`

Specify bar position as string. Possible values are `left`, `right`, `top` and `bottom`.

#### mode

Type: `string`, Default: `float`

Specify bar mode as string. Possible values are:

- `float` - The bar will slide in and float over the content.
- `push` - The bar will slide in, and the content wrap will be pushed away from the bar.
- `reveal` - Content wrap will be pushed away, revealing the bar underneath

#### overlay

Type: `boolean`, Default: `true`

Show shading overlay over content wrap when bar is open.

#### permanent

Type: `boolean`, Default: `false`

If enabled, the bar is not closable by clicking overlay of pressing `esc` key.

**IMPORTANT:** If you enable this, remember to provide a way to close the bar.

#### scrollTop

Type: `boolean`, Default: `true`

If enabled, bar will be scrolled to top when opening it.

## API

### destroy()

Destroys the Bartender instance.

### getBar(name)



