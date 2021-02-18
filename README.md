# Bartender.js - Accessible off-canvas bars

Bartender is a simple zero-dependency library for creating accessible off-canvas bars to your website. Multiple bars are supported, and they can be located in any side of the viewport.

The following accessibility concerns have been taken into account:

- When off-canvas bar is closed, it's child elements are not focusable
- When bar is open, it's child elements are focusable, and the focus will be initially set on the bar element
- After closing the bar the focus will return to the button which was used to open the bar

## Getting started

Check `/demo/minimal.html` for minimal working example:

```html
<!DOCTYPE html>

<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
    />
    <link rel="stylesheet" href="bartender.css" />
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

    <script src="bartender.js"></script>
    <script>
      // Initialize Bartender
      const bartender = new Bartender();
    </script>
  </body>
</html>
```

### 1. Include CSS

```html
<link rel="stylesheet" href="bartender.css" />
```

### 2. Include JS

```html
<script src="bartender.js"></script>
```

### 3. Set the required wrapper elements

#### bartender-main

This element will act as a main wrapper for Bartender. Most likely this will be your body element.

```html
<!-- Main wrap for bartender -->
<body class="bartender-main"></body>
```

#### bartender-content

This element will be the wrapper for your page main content. **Place this element as a direct child of Bartender main element.**

```html
<!-- Wrapper for page content -->
<div class="bartender-content"></div>
```

### 4. Add one more more bars

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

Content wrapper will be pushed away, revealing bar underneath.

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
  closeOnEsc: true,
  mainWrapSelector: '.bartender-main',
  contentWrapSelector: '.bartender-content',
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

### closeOnEsc

Type: `boolean`, Default: `true`

Close any open bar using escape key.

### mainWrapSelector

Type: `string`, Default: `.bartender-main`

This selector will be used to find main wrapper.

### contentWrapSelector

Type: `string`, Default: `.bartender-content`

This selector will be used to find content wrapper.

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

## Events

Add event listener(s) to the Bartender main wrapper element to catch event triggered by the library. The following events are available:

### open

This event is triggered immediately when bar has _started to open_. The bar object and the button used to open the bar will be included in `detail` object.

### afterOpen

This event is triggered when bar has _finished to open_ (transition is finished). The bar object and the button used to open the bar will be included in `detail` object.

### close

This event is triggered immediately when bar has _started to open_. The bar object and the button used to open the bar will be included in `detail` object.

### afterClose

This event is triggered when bar has _finished to close_ (transition is finished). The bar object and the button used to open the bar will be included in `detail` object.

```javascript
// Example event listener
bartender.mainWrap.addEventListener('open', (e) => {
  console.log("Opening bar '" + e.detail.bar.position + "'");
});
```
