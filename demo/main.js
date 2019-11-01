'use strict';

var offCanvas = new OffCanvas({
  debug: true,
  overlay: true,
})

// Test event listeners
offCanvas.mainWrap.addEventListener('open', e => {
  console.log('Event listener: Opening bar ' + e.detail.bar.position)
  console.log(e.detail)
})

offCanvas.mainWrap.addEventListener('close', e => {
  console.log('Event listener: Closing bar ' + e.detail.bar.position)
  console.log(e.detail)
})