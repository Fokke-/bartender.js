'use strict';

var offCanvas = new OffCanvas({
  debug: true,
  overlay: false,
}).addBar('left', {
  mode: 'float',
}).addBar('right', {
  mode: 'push',
}).addBar('top', {
  mode: 'push',
}).addBar('bottom', {
  mode: 'float',
})