'use strict';

var offCanvas = new OffCanvas({
  debug: true,
  mainWrapSelector: '.test-main',
  contentWrapSelector: '.test-content',
}).addBar('left', {
  selector: '.test-bar--left',
  mode: 'float',
}).addBar('right', {
  selector: '.test-bar--right',
  mode: 'push',
}).addBar('top', {
  selector: '.test-bar--top',
  mode: 'push',
}).addBar('bottom', {
  selector: '.test-bar--bottom',
  mode: 'float',
})