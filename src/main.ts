import { Bartender } from './Bartender/Bartender'
import './Bartender/style.scss'
import './main.scss'

declare global {
  interface Window {
    bartender: Bartender;
  }
}

window.bartender = new Bartender({
  debug: true,
})

window.bartender.addBar('left', {
  position: 'left',
  mode: 'push',
  elSelector: '.leftBar',
})

window.bartender.addBar('right', {
  position: 'right',
  mode: 'float',
  elSelector: '.rightBar',
})

window.bartender.addBar('rightExtra', {
  position: 'right',
  mode: 'reveal',
  elSelector: '.rightBarExtra',
})

window.bartender.addBar('top', {
  position: 'top',
  mode: 'push',
  elSelector: '.topBar',
})

window.bartender.addBar('bottom', {
  position: 'bottom',
  mode: 'float',
  elSelector: '.bottomBar',
  overlay: false,
})

const toggleButtons = document.querySelectorAll('.toggleButton')
for (const button of Array.from(toggleButtons)) {
  button.addEventListener('click', () => {
    window.bartender.toggle(button.getAttribute('data-bar') || '')
  })
}

const openLeft = document.querySelector('.openLeft')
openLeft?.addEventListener('click', () => {
  window.bartender.toggle('left')
})

const openRight = document.querySelector('.openRight')
openRight?.addEventListener('click', () => {
  window.bartender.toggle('right')
})

const openRightExtra = document.querySelector('.openRightExtra')
openRightExtra?.addEventListener('click', () => {
  window.bartender.toggle('rightExtra')
})

const openTop = document.querySelector('.openTop')
openTop?.addEventListener('click', () => {
  window.bartender.toggle('top')
})

const openBottom = document.querySelector('.openBottom')
openBottom?.addEventListener('click', () => {
  window.bartender.toggle('bottom')
})

const spamToggle = document.querySelector('.spamToggle')
spamToggle?.addEventListener('click', async () => {
  // Get array of bars in random order
  const barStack = Array.from({ length: 10 }, () => {
    return window.bartender.bars[Math.floor(Math.random() * window.bartender.bars.length)]
  })

  console.table(barStack)

  for (const bar of barStack) {
    window.bartender.toggle(bar.name)
  }

  window.bartender.close()
})

const spamOpen = document.querySelector('.spamOpen')
spamOpen?.addEventListener('click', async () => {
  // Get array of bars in random order
  const barStack = Array.from({ length: 10 }, () => {
    return window.bartender.bars[Math.floor(Math.random() * window.bartender.bars.length)]
  })

  console.table(barStack)

  for (const bar of barStack) {
    window.bartender.open(bar.name)
  }

  window.bartender.close()
})
