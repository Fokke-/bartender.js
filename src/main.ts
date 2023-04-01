import { Bartender } from './lib/Bartender'
import './assets/bartender.scss'
import './assets/styles.scss'

declare global {
  interface Window {
    bartender: Bartender;
  }
}

window.bartender = new Bartender({
  debug: true,
  el: '.bartender',
})

const leftBar = window.bartender.addBar('left', {
  el: '.leftBar',
  position: 'left',
  mode: 'push',
})

const rightBar = window.bartender.addBar('right', {
  el: '.rightBar',
  position: 'right',
  mode: 'float',
})

const rightExtraBar = window.bartender.addBar('rightExtra', {
  el: '.rightBarExtra',
  position: 'right',
  mode: 'reveal',
})

const topBar = window.bartender.addBar('top', {
  el: '.topBar',
  position: 'top',
  mode: 'push',
})

const bottomBar = window.bartender.addBar('bottom', {
  el: '.bottomBar',
  position: 'bottom',
  mode: 'float',
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
