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

const leftBar = window.bartender.addBar('left', {
  position: 'left',
  mode: 'push',
  elSelector: '.leftBar',
})

const rightBar = window.bartender.addBar('right', {
  position: 'right',
  mode: 'float',
  elSelector: '.rightBar',
})

const rightExtraBar = window.bartender.addBar('rightExtra', {
  position: 'right',
  mode: 'reveal',
  elSelector: '.rightBarExtra',
})

const topBar = window.bartender.addBar('top', {
  position: 'top',
  mode: 'push',
  elSelector: '.topBar',
})

const bottomBar = window.bartender.addBar('bottom', {
  position: 'bottom',
  mode: 'float',
  elSelector: '.bottomBar',
  overlay: false,
})

const fixedBarBottom = document.querySelector('.toolBar--fixed.toolBar--bottom') as HTMLElement
if (fixedBarBottom) {
  window.bartender.addPushElement({
    el: fixedBarBottom,
  })
}

const toggleButtons = document.querySelectorAll('.toggleButton')
for (const button of Array.from(toggleButtons)) {
  button.addEventListener('click', () => {
    window.bartender.toggle(button.getAttribute('data-bar') || '')
  })
}

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
