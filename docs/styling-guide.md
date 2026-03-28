# Styling guide

[The default style sheet](https://github.com/Fokke-/bartender.js/blob/master/src/assets/bartender.scss)
contains only enough styles for the bars to be rendered correctly.
Bars will have predefined dimensions and a simple sliding transition.

Browser needs to support `transition-behavior: allow-discrete` to properly handle the transitions.
If the browser cannot handle this property, bars will still work fine, just without any transitions.

[Animating dialog elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#animating_dialogs)
requires the same styles to be applied under multiple selectors. That's why all styles related to the bar dimensions and transitions
are defined by using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), under `.bartender-bar` selector.

::: info
Note that all transitions are disabled if user prefers reduced motion.
:::

## Width and height with fallbacks

Width and height related properties have fallback properties, as some browsers don't support `dvw` or `dvh` units.
If you redefine width or height (or max-width/max-height) using those units, remember to set the fallback properties too.

For example, if we want to set bar max-width to `50dvw`, we need to style it like this:

```css
.mobileNav {
  --max-width: 50dvw;
  --max-width-fallback: 50vw;
}

// Without fallbacks
.mobileNav {
  --max-width: 500px;
}
```

## Global styles for all bars

You may want to define some global styles, which will apply to all the bars.

```css
.bartender-bar {
  --transition-duration: 500ms;
  --opacity-leave: 0;
}

// For left positioned bars
.bartender-bar--position-left {
  --overlay-background: maroon;
}
```

## Available CSS custom properties

### Dimensions

| Property              | Default value                   | Description                 |
| --------------------- | ------------------------------- | --------------------------- |
| --width               | 80dvw (for left and right bars) | Width                       |
| --width-fallback      | 80vw (for left and right bars)  | Fallback for width          |
| --max-width           | 400px (for left and right bars) | Maximum width               |
| --max-width-fallback  | unset                           | Fallback for maximum width  |
| --height              | 40dvh (for top and bottom bars) | Height                      |
| --height-fallback     | 40vh (for top and bottom bars)  | Fallback for height         |
| --max-height          | 400px (for top and bottom bars) | Maximum height              |
| --max-height-fallback | unset                           | Fallback for maximum height |

### Transform and animate

| Property                           | Default value                     | Description                               |
| ---------------------------------- | --------------------------------- | ----------------------------------------- |
| --opacity-enter                    | 1                                 | Opacity for open bar                      |
| --opacity-leave                    | 1                                 | Opacity for closed bar                    |
| --transform-enter                  | translate(0, 0)                   | Transform for open bar                    |
| --transform-leave                  | (depends on bar position)         | Transform for closed bar                  |
| --transition-duration              | 250ms                             | Global transition duration                |
| --transition-duration-enter        | var(--transition-duration)        | Transition duration for open bar          |
| --transition-duration-leave        | var(--transition-duration)        | Transition duration for closed bar        |
| --transition-timing-function       | ease                              | Global transition timing function         |
| --transition-timing-function-enter | var(--transition-timing-function) | Transition timing function for open bar   |
| --transition-timing-function-leave | var(--transition-timing-function) | Transition timing function for closed bar |
| --animation-name                   | unset                             | Global animation name                     |
| --animation-name-enter             | var(--animation-name)             | Animation name for open bar               |
| --animation-name-leave             | var(--animation-name)             | Animation name for closed bar             |
| --animation-timing-function        | unset                             | Global animation timing function          |
| --animation-timing-function-enter  | var(--animation-timing-function)  | Animation timing function for open bar    |
| --animation-timing-function-leave  | var(--animation-timing-function)  | Animation timing function for closed bar  |
| --animation-direction              | normal                            | Global animation direction                |
| --animation-direction-enter        | var(--animation-direction)        | Animation direction for open bar          |
| --animation-direction-leave        | var(--animation-direction)        | Animation direction for closed bar        |

### Overlay shading

| Property                                   | Default value                           | Description                                     |
| ------------------------------------------ | --------------------------------------- | ----------------------------------------------- |
| --overlay-background                       | #000                                    | Overlay background color                        |
| --overlay-opacity                          | 0.5                                     | Overlay opacity for open bar                    |
| --overlay-transition-duration-enter        | var(--transition-duration-enter)        | Overlay transition duration for open bar        |
| --overlay-transition-duration-leave        | var(--transition-duration-leave)        | Overlay transition duration for closed bar      |
| --overlay-transition-timing-function-enter | var(--transition-timing-function-enter) | Overlay transition timing function for open bar |
| --overlay-transition-timing-function-leave | var(--transition-timing-function-leave) | Overlay transition timing function for open bar |

## Examples

### Full screen bar

```javascript
// Bar config
{
  position: 'top',
}
```

```css
.full-screen-bar {
  --width: 100dvw;
  --width-fallback: 100vw;
  --max-width: 100dvw;
  --max-width-fallback: 100vw;
  --height: 100dvh;
  --height-fallback: 100vh;
  --max-height: 100dvh;
  --max-height-fallback: 100vh;
  --transition-duration-enter: 500ms;
  --transition-duration-leave: 250ms;
}
```

<FullScreenBar />

---

### Centered full screen bar

```javascript
// Bar config
{
  position: center,
}
```

```css
.centered-full-screen-bar {
  --overlay-opacity: 0.85;
  --transition-duration-enter: 500ms;
  --transition-duration-leave: 250ms;
  text-align: center;
  color: #fff;
  background: transparent;
}
```

<CenteredFullScreenBar />

---

### Bar with animation

In addition to transforms, you can also animate the bar with `--animation-*` properties.

```js
{
  position: right,
}
```

```css
@keyframes slide-in {
  0% {
    transform: translateX(800px) scale(0);
    transform-origin: -100% 50%;
    opacity: 0;
  }
  100% {
    transform: translateX(0) scale(1);
    transform-origin: -1800px 50%;
    opacity: 1;
  }
}

@keyframes slide-out {
  0% {
    transform: translateX(0) scale(1);
    transform-origin: -1800px 50%;
    opacity: 1;
  }
  100% {
    transform: translateX(1000px) scale(0);
    transform-origin: -100% 50%;
    opacity: 1;
  }
}

.bar-with-animation {
  --max-width: 500px;
  --transition-duration-enter: 600ms;
  --transition-duration-leave: 400ms;
  --animation-name-enter: slide-in;
  --animation-name-leave: slide-out;
}
```

<BarWithAnimation />
