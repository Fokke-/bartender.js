import { Bartender } from './Bartender/Bartender'
import './Bartender/style.scss'

window.addEventListener('bartender-init', ((e: CustomEvent) => {
  console.log('Bartender init')
  console.log(e.detail)
}) as EventListener)

window.addEventListener('bartender-bar-added', ((e: CustomEvent) => {
  console.log('Bar init')
  console.log(e.detail)
}) as EventListener)

const bartender = new Bartender({
  debug: true,
})

bartender.addBar('mobileNavBar', {
  position: 'left',
  elSelector: '.mobileNavBar',
})

// const bar = bartender.addBar('mobileNavBar', {
//   position: 'right',
//   elSelector: '.mobileNavBar',
// })

// console.log(bartender)
