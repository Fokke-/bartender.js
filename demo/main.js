'use strict';

const bartender = new Bartender({
  debug: true,
  overlay: true,
})

// Test event listeners
bartender.mainWrap.addEventListener('open', e => {
  console.log('Event listener: Opening bar ' + e.detail.bar.position)
  console.log(e.detail)
})

bartender.mainWrap.addEventListener('close', e => {
  console.log('Event listener: Closing bar ' + e.detail.bar.position)
  console.log(e.detail)
})