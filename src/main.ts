import { Bartender } from './Bartender/Bartender'
import './Bartender/style.scss'
import './main.scss'

const bartender = new Bartender({
  debug: true,
}).addBar('left', {
  position: 'left',
  elSelector: '.leftBar',
}).addBar('right', {
  position: 'right',
  elSelector: '.rightBar',
}).addBar('rightExtra', {
  position: 'right',
  elSelector: '.rightBarExtra',
}).addBar('top', {
  position: 'top',
  elSelector: '.topBar',
}).addBar('bottom', {
  position: 'bottom',
  elSelector: '.bottomBar',
})

const openLeft = document.querySelector('.openLeft')
openLeft?.addEventListener('click', () => {
  bartender.getBar('left')?.toggle()
})

const openRight = document.querySelector('.openRight')
openRight?.addEventListener('click', () => {
  bartender.getBar('right')?.toggle()
})

const openRightExtra = document.querySelector('.openRightExtra')
openRightExtra?.addEventListener('click', () => {
  bartender.getBar('rightExtra')?.toggle()
})

const openTop = document.querySelector('.openTop')
openTop?.addEventListener('click', () => {
  bartender.getBar('top')?.toggle()
})

const openBottom = document.querySelector('.openBottom')
openBottom?.addEventListener('click', () => {
  bartender.getBar('bottom')?.toggle()
})
