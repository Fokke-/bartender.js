import { Bartender } from './Bartender/Bartender'
import './Bartender/style.scss'
import './main.scss'

const bartender = new Bartender({
  debug: true,
}).addBar('left', {
  position: 'left',
  mode: 'push',
  elSelector: '.leftBar',
}).addBar('right', {
  position: 'right',
  mode: 'float',
  elSelector: '.rightBar',
}).addBar('rightExtra', {
  position: 'right',
  mode: 'reveal',
  elSelector: '.rightBarExtra',
}).addBar('top', {
  position: 'top',
  mode: 'push',
  elSelector: '.topBar',
}).addBar('bottom', {
  position: 'bottom',
  mode: 'float',
  elSelector: '.bottomBar',
})

const openLeft = document.querySelector('.openLeft')
openLeft?.addEventListener('click', () => {
  bartender.toggle('left')
})

const openRight = document.querySelector('.openRight')
openRight?.addEventListener('click', () => {
  bartender.toggle('right')
})

const openRightExtra = document.querySelector('.openRightExtra')
openRightExtra?.addEventListener('click', () => {
  bartender.toggle('rightExtra')
})

const openTop = document.querySelector('.openTop')
openTop?.addEventListener('click', () => {
  bartender.toggle('top')
})

const openBottom = document.querySelector('.openBottom')
openBottom?.addEventListener('click', () => {
  bartender.toggle('bottom')
})
