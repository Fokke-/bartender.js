# Events

## bartender-init

Bartender has been initialized. Instance will be included in `detail` object.

```javascript
window.addEventListener('bartender-init', (event) => {
  console.log(event.detail.bartender)
})
```

## bartender-destroyed

Bartender instance has been destroyed. Instance will be included in `detail` object.

```javascript
window.addEventListener('bartender-destroyed', (event) => {
  console.log(event.detail.bartender)
})
```

## bartender-bar-added

A new bar has been added. Bar will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-added', (event) => {
  console.log(event.detail.bar)
})
```

## bartender-bar-removed

The bar has been removed. Bar name will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-removed', (event) => {
  console.log(event.detail.name)
})
```

## bartender-bar-updated

One of the following bar properties has changed:

- position
- overlay
- permanent
- scrollTop

Bar, updated property name and property value will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-updated', (event) => {
  console.log(
    `Updated bar '${event.detail.bar.name}' property '${event.detail.property}' to '${event.detail.value}'`,
  )
})
```

## bartender-bar-before-open

Bar has started to open. Bar will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-before-open', (event) => {
  console.log(event.detail.bar)
})
```

## bartender-bar-after-open

Bar is open. Bar will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-after-open', (event) => {
  console.log(event.detail.bar)
})
```

## bartender-bar-before-close

Bar has started to close. Bar will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-before-close', (event) => {
  console.log(event.detail.bar)
})
```

## bartender-bar-after-close

Bar is closed. Bar will be included in `detail` object.

```javascript
window.addEventListener('bartender-bar-after-close', (event) => {
  console.log(event.detail.bar)
})
```
