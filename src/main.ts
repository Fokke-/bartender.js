import { Bartender } from './lib/Bartender'
import './assets/bartender.scss'
import './assets/styles.scss'

declare global {
  interface Window {
    bartender: Bartender;
  }
}

window.bartender = new Bartender({ debug: true }, { focusTrap: true })

window.bartender.addBar('left', {
  el: '.bar--left',
  position: 'left',
  mode: 'push',
})

window.bartender.addBar('right', {
  el: '.bar--right',
  position: 'right',
  mode: 'float',
  focusTrap: false,
})

window.bartender.addBar('rightExtra', {
  el: '.bar--rightExtra',
  position: 'right',
  mode: 'reveal',
  overlay: false,
})

window.bartender.addBar('top', {
  el: '.bar--top',
  position: 'top',
  mode: 'push',
})

window.bartender.addBar('bottom', {
  el: '.bar--bottom',
  position: 'bottom',
  mode: 'reveal',
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
      'reveal',
    ],
  })
}

const toggleButtons = document.querySelectorAll('.toggleButton')
for (const button of Array.from(toggleButtons)) {
  button.addEventListener('click', (event) => {
    window.bartender.toggle(button.getAttribute('data-bar') || '', event.target as HTMLElement)
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
