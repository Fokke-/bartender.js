import { Bartender } from './lib/Bartender'
import './assets/bartender.scss'
import './assets/styles.scss'

declare global {
  interface Window {
    bartender: Bartender;
  }
}

window.bartender = new Bartender({ debug: true })

window.bartender.addBar('left', {
  el: '.bar--left',
  position: 'left',
  mode: 'push',
})

window.bartender.addBar('right', {
  el: '.bar--right',
  position: 'right',
  mode: 'float',
})

window.bartender.addBar('rightPermanent', {
  el: '.bar--rightPermanent',
  position: 'right',
  mode: 'push',
  overlay: false,
  permanent: true,
})

window.bartender.addBar('top', {
  el: '.bar--top',
  position: 'top',
  mode: 'push',
})

window.bartender.addBar('bottom', {
  el: '.bar--bottom',
  position: 'bottom',
  mode: 'push',
})

const fixedBarBottom = document.querySelector('.toolBar--fixed.toolBar--bottom') as HTMLElement
if (fixedBarBottom) {
  window.bartender.addPushElement(fixedBarBottom, {
    positions: [
      'left',
      'right',
      'bottom',
    ],
    modes: [
      'push',
    ],
  })
}

const toggleButtons = document.querySelectorAll('.toggleButton')
for (const button of Array.from(toggleButtons)) {
  button.addEventListener('click', () => {
    window.bartender.toggle(button.getAttribute('data-bar') || '')
  })
}

const closeButtons = document.querySelectorAll('.closeButton')
for (const button of Array.from(closeButtons)) {
  button.addEventListener('click', () => {
    window.bartender.close()
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
