# Adding a new bar

Dialog element comes in two flavours, modal and standard dialog, which both are supported by the library. Modal will be used as a default.

## Modal

In modal mode focus will be trapped to the bar and interaction with elements outside the bar will be disabled.

::: tip
Remember to provide a way to close the bar with keyboard. Even though by default bar will be closed by hitting `esc` key or clicking outside the bar, adding a dedicated close button to the bar is highly recommended.
:::

## Standard dialog

In standard dialog mode bar will open as a fixed element and interaction with elements outside the bar is allowed. This mode can be useful if you plan to keep the bar as a permanent component of your layout.

::: info Note that in standard dialog mode the following exceptions will take place:

- Overlay shading will not be rendered.
- `permanent` setting will have no effect.
- Bar is not closeable by hitting `esc` key.
- Bar will not be closed by clicking outside the bar.
- Bar will not be closed when another bar is opened with `keepOtherBarsOpen: true`.
- Bar will not be closed when `Bartender.closeAll()` is called without any arguments.
  :::

## addBar()

| Argument | Type                  | Default | Description                         |
| -------- | --------------------- | ------- | ----------------------------------- |
| name     | `string`              |         | Unique name for the bar             |
| options  | `BartenderBarOptions` | `{}`    | [Bar options](#bartenderbaroptions) |

```javascript
bartender.addBar('mobileNav', {
  el: document.querySelector('.mobileNav'),
  position: 'left',
})
```

### Bar options

| Property  | Type                                                 | Default  | Description                                                     |
| --------- | ---------------------------------------------------- | -------- | --------------------------------------------------------------- |
| el        | `string \| element`                                  |          | Bar element as selector string or reference to the element.     |
| position  | `'left' \| 'right' \| 'top' \| 'bottom' \| 'center'` | `'left'` | Bar position                                                    |
| modal     | `boolean`                                            | `true`   | Open bar as a modal?                                            |
| overlay   | `boolean`                                            | `true`   | Show overlay shading over the content when bar is open?         |
| permanent | `boolean`                                            | `false`  | Bar is not closeable by clicking overlay of pressing `esc` key. |
| scrollTop | `boolean`                                            | `true`   | Bar will be scrolled to top after opening it.                   |

## Modifying bar settings

Bar options can be modified on the fly, except for the `el` property.

```javascript
bartender.getBar('mobileNav').position = 'right'
```
