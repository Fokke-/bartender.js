# Bartender.js - Accessible off-canvas bars

Bartender is a simple zero-dependency library for creating accessible off-canvas bars to your website. Multiple bars are supported, and they can be located in any side of the viewport.

The following accessibility concerns have been taken into account:

- When off-canvas bar is closed, it's child elements are not focusable
- When bar is open, only it's child elements are focusable, and the focus will be initially set on the bar element
- After closing the bar the focus will return to the button which was used to open the bar

## Browser support

All major browsers are supported. If you need to support IE11, use compatibility build.

## Install using NPM

```console
npm i @fokke-/bartender.js
```

## Using the library

Check `/demo/minimal.html` for minimal working example. Note that it's highly recommended to define viewport meta tag to avoid buggy rendering when using bars with `push` or `reveal` modes.

```html
<!doctype html>

<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="../dist/bartender.min.css">
  </head>

  <!-- Main wrap for bartender -->
  <body class="bartender-main">

    <!-- Wrapper for page content -->
    <div class="bartender-content">
      <button data-bartender-open="left">Open left bar</button>
    </div>

    <!-- Left bar -->
    <div data-bartender-bar="left" data-bartender-bar-mode="float">
      <button data-bartender-close>Close</button>
    </div>

    <script src="../dist/bartender.min.js"></script>
    <script>
      // Initialize Bartender
      const bartender = new Bartender();
    </script>
  </body>
</html>
```

### 1. Include CSS

#### Import SCSS

```scss
// If you're using webpack etc...
@import '@fokke-/bartender.js/dist/bartender.scss';

// Or if you extracted the library in your project directory
@import './dist/bartender.scss'
```

#### ...or include CSS manually

```html
<link rel="stylesheet" href="dist/bartender.css">
```

#### ...or include CSS from CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@fokke-/bartender.js@1.0.4/dist/bartender.min.css">
```

### 2. Include JS

#### Import module

```javascript
import Bartender from '@fokke-/bartender.js'
```

#### ...or include JS manually

```html
<!-- Standard build -->
<script src="dist/bartender.js"></script>

<!-- Compatibility build with IE11 support -->
<script src="dist/bartender.compat.js"></script>
```

#### ...or include JS from CDN

```html
<!-- Standard build -->
<script src="https://unpkg.com/@fokke-/bartender.js@1.0.4/dist/bartender.min.js"></script>

<!-- Compatibility build with IE11 support -->
<script src="https://unpkg.com/@fokke-/bartender.js@1.0.4/dist/bartender.compat.js"></script>
```

### 3. Set the required wrapper elements

- `bartender-main` will act as a main wrapper for Bartender. Most likely this will be your body element.
- `bartender-content` is the wrapper element for your page content.

```html
<!-- Main wrap for bartender -->
<body class="bartender-main">
  <!-- Wrapper for page content -->
  <div class="bartender-content">

  </div>

  <!-- Place your bars here later -->
</body>
```

### 4. Add one or more bars

The bar elements need to have `data-bartender-bar` attribute with desired position (left, right, top, bottom) as a value. **Place all bar elements as direct children of Bartender main element.**

```html
<!-- Left bar -->
<div data-bartender-bar="left" data-bartender-bar-mode="float"></div>

<!-- Right bar -->
<div data-bartender-bar="right" data-bartender-bar-mode="float"></div>
```

You can also specify `data-bartender-bar-mode` attribute to specify transition mode for the bar. The following modes are available:

#### float

The bar will float over the content. This is the default mode.

#### push

The bar will slide in, and the content wrapper will be pushed away from the bar.

#### reveal

Content wrapper will be pushed away, revealing the bar underneath.

### 5. Add buttons for opening or toggling bars (optional)

Note that these buttons can also be placed in bars too. For example, you can open right bar from the left bar.

```html
<button data-bartender-open="left">Open left bar</button>
<button data-bartender-toggle="left">Toggle left bar</button>
```

### 6. Add buttons for closing bars (optional)

If you want to create button (or any other element) to close any open bar, add `data-bartender-close` attribute to the element.

```html
<button data-bartender-close>Close bar</button>
```

### 7. Initialize Bartender

```javascript
// Use default options
const bartender = new Bartender();
```

## Options

You can pass an object as an argument for Bartender constructor to modify default options.

```javascript
const bartender = new Bartender({
  debug: false,
  overlay: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
  trapFocus: false,
  scrollTop: true,
  mainWrapSelector: '.bartender-main',
  contentWrapSelector: '.bartender-content',
  focusableElementSelector: '[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
  readyClass: 'bartender-ready',
  openClass: 'bartender-open',
});
```

### debug

Type: `boolean`, Default: `false`

Enable debugging mode. If enabled, Bartender will log it's activity to console.

### overlay

Type: `boolean`, Default: `true`

Show shading overlay when bar is open.

### closeOnOverlayClick

Type: `boolean`, Default: `true`

Close any open bar by clicking the overlay.

### closeOnEsc

Type: `boolean`, Default: `true`

Close any open bar using escape key.

### trapFocus

Type: `boolean`, Default: `false`

If bar is open, focus will be trapped to the open bar and it's child elements, and elements within content wrap are not focusable. If this option is enabled, you **should** provide user a way to close the bar with keyboard by adding close button in the bar.

If you have lots of focusable elements, this operation can also be quite expensive performance-wise.

### scrollTop

Type: `boolean`, Default: `true`

Scroll bar to the top when opening it.

### mainWrapSelector

Type: `string`, Default: `.bartender-main`

This selector will be used to find main wrapper.

### contentWrapSelector

Type: `string`, Default: `.bartender-content`

This selector will be used to find content wrapper.

### focusableElementSelector

Type: `string`, Default: `[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])`

This selector will be used to find focusable elements.

### readyClass

Type: `string`, Default: `bartender-ready`

This class will be added to the main wrapper when Bartender has been initialized.

### openClass

Type: `string`, Default: `bartender-open`

This class will be added to the main wrapper when any bar is open.

## API

### open(position)

Open bar element. Specify bar position (left, right, top, bottom) as an argument.

```javascript
bartender.open('left');
```

### close()

Close any open bar element.

```javascript
bartender.close();
```

### toggle(position)

Toggle bar element. If bar is closed, open it. Otherwise close it. Specify bar position (left, right, top, bottom) as an argument.

```javascript
bartender.toggle('left');
```

## Styling

### Bars

```css
/* These styles apply to all bars */
[data-bartender-bar] {
  background: red;
}

/* These styles apply only to the left bar */
[data-bartender-bar='left'] {
  background: #ff69b4;
}
```

By default bars will be animated using transition `transform 250ms linear`. You can override this if you're using scss:

```scss
$bartender-transition: transform 500ms linear;
```

### Overlay shading

```css
.bartender-overlay {
  background: #ff69b4;
  opacity: 0.5;
}
```

## Events

Add event listener(s) to the Bartender main wrapper element to catch event triggered by the library. All these events bubble, so you can add event listener to the window object too.

```javascript
// Example event listener
bartender.mainWrap.addEventListener('bartender-open', (e) => {
  console.log("Opening bar '" + e.detail.bar.position + "'");
});
```

### The following events are available

#### bartender-open

This event is triggered immediately when bar has _started to open_. The bar object and the button used to open the bar will be included in `detail` object.

#### bartender-close

This event is triggered immediately when bar has _started to close_. The bar object will be included in `detail` object.
