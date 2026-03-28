# Main instance

## construct()

Create a new main instance by calling constructor.

| Argument          | Type                         | Default | Description                                                   |
| ----------------- | ---------------------------- | ------- | ------------------------------------------------------------- |
| options           | `BartenderOptions`           | `{}`    | [Main options](#main-options)                                 |
| barDefaultOptions | `BartenderBarDefaultOptions` | `{}`    | [Default options for new bars](#default-options-for-new-bars) |

```javascript
const bartender = new Bartender(
  {
    // Main options
    debug: true,
  },
  {
    // default options for new bars
  },
)
```

### Main options

| Property | Type      | Default | Description                                                                 |
| -------- | --------- | ------- | --------------------------------------------------------------------------- |
| debug    | `boolean` | `false` | If enabled, Bartender will log it's activity to console at debug log level. |

### Default options for new bars

| Property  | Type                                                 | Default  | Description                                                     |
| --------- | ---------------------------------------------------- | -------- | --------------------------------------------------------------- |
| position  | `'left' \| 'right' \| 'top' \| 'bottom' \| 'center'` | `'left'` | Bar position                                                    |
| modal     | `boolean`                                            | `true`   | Open bar as a modal?                                            |
| overlay   | `boolean`                                            | `true`   | Show overlay shading over the content when bar is open?         |
| permanent | `boolean`                                            | `false`  | Bar is not closeable by clicking overlay of pressing `esc` key. |
| scrollTop | `boolean`                                            | `true`   | Bar will be scrolled to top after opening it.                   |

## destroy()

Destroy Bartender instance.

```javascript
bartender.destroy()
```
