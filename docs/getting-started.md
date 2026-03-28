# Getting started

## With bundler (Vite, Webpack etc.)

```console
npm i @fokke-/bartender.js
```

### Include CSS

```javascript
import '@fokke-/bartender.js/dist/bartender.css'
```

### Markup

```html
<!-- Button for opening the bar -->
<button class="openMobileNav">Open mobile navigation</button>

<!-- Add any number of bars as dialog elements -->
<dialog class="mobileNav">
  <button class="closeMobileNav">Close mobile navigation</button>
</dialog>
```

### Initialize the library

```javascript
import { Bartender } from '@fokke-/bartender.js'

// Create main instance
const bartender = new Bartender()

// Add a new bar
bartender.addBar('mobileNav', {
  el: document.querySelector('.mobileNav'),
  position: 'left',
})

// Handle open button
document.querySelector('.openMobileNav').addEventListener('click', (event) => {
  bartender.open('mobileNav')
})

// Handle close button
document.querySelector('.closeMobileNav').addEventListener('click', (event) => {
  bartender.close()
})
```

## Use directly from CDN

```html
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://unpkg.com/@fokke-/bartender.js@3/dist/bartender.css"
    />
  </head>
  <body>
    <!-- Button for opening the bar -->
    <button class="openMobileNav">Open mobile navigation</button>

    <!-- Add any number of bars as dialog elements -->
    <dialog class="mobileNav">
      <button class="closeMobileNav">Close mobile navigation</button>
    </dialog>

    <script type="module">
      import { Bartender } from 'https://unpkg.com/@fokke-/bartender.js@3/dist/bartender.js'

      // Create main instance
      const bartender = new Bartender()

      // Add a new bar
      bartender.addBar('mobileNav', {
        el: document.querySelector('.mobileNav'),
        position: 'left',
      })

      // Handle open button
      document
        .querySelector('.openMobileNav')
        .addEventListener('click', (event) => {
          bartender.open('mobileNav')
        })

      // Handle close button
      document
        .querySelector('.closeMobileNav')
        .addEventListener('click', (event) => {
          bartender.close()
        })
    </script>
  </body>
</html>
```
