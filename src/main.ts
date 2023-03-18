import { Bartender } from './Bartender/Bartender'

const bartender = new Bartender({
  debug: true,
  mainEl: '.bartender',
  contentEl: document.querySelector('.bartender__content'),
})

bartender.addBar('mobileNavBar', {
  position: 'right',
  el: '.mobileNavBar',
})
