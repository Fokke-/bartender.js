## 3.1.2

### Bug fixes

- Removed incorrect global type declaration

## 3.1.1

### Bug fixes

- Fixed bug where `--overlay-opacity` was not applied.

## 3.1.0

### New Features

- Added support for centered bars.

## 3.0.0

### New features

- Bars use [dialog elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog), providing a native accessibility.
- Multiple bars can now be open simultaneously.
- Bar can be opened as a [modal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) (restrict interaction to the bar) or as a [standard dialog](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show) (allow interaction with the content outside).
- Use [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to provide an easy way to customize bar transforms, transitions etc.
- Wrap elements for Bartender or Bartender content are no longer needed.
- UMD build is included.
- Removed all dependencies.

### Breaking changes

- Bar `mode` property is removed. Due to the nature of dialog elements and the removal of content wrap, only `float` mode can be supported.
- "Polyfilling" dvh units is removed. Bars will use `dvh` and `dvw` units with `vh` and `vw` as fallbacks.
- Pushable elements are removed. Since the library now supports multiple bars to be open simultaneously, the implementation was proven even more unreliable. Similar feature can be archieved with event listeners and CSS.
- `.bartender--ready` class name is changed to `.bartender-ready`.
- `.bartender__bar` class name is changed to `.bartender-bar`.
