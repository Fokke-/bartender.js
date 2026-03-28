# Getting an existing bar instance

## getBar()

Get bar instance by name.

| Argument | Type     | Default | Description |
| -------- | -------- | ------- | ----------- |
| name     | `string` |         | Bar name    |

```javascript
bartender.getBar('mobileNav')
```

## getOpenBar()

Get the topmost open bar instance.

| Argument | Type                   | Default | Description                                                                                                             |
| -------- | ---------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| modal    | `boolean \| undefined` |         | `undefined` -> Search from all bars. `true` -> Search from modal bars only. `false` -> Search from non-modal bars only. |

```javascript
// Get the topmost open bar, regardless of the modal property
bartender.getOpenBar()

// Get the topmost open modal bar
bartender.getOpenBar(true)

// Get the topmost open non-modal bar
bartender.getOpenBar(false)
```
