import { Bartender } from './lib/Bartender'
import './assets/bartender.scss'
import './assets/styles.scss'

const bartender = new Bartender({ debug: false })
window.bartender = bartender

bartender.addBar('left', {
  el: '.bar--left',
  position: 'left',
})

bartender.addBar('right', {
  el: '.bar--right',
  position: 'right',
})

bartender.addBar('right2', {
  el: '.bar--right2',
  position: 'right',
  permanent: true,
})

bartender.addBar('top', {
  el: '.bar--top',
  position: 'top',
})

bartender.addBar('bottom', {
  el: '.bar--bottom',
  position: 'bottom',
})

const fixedBarBottom = document.querySelector(
  '.toolBar--fixed.toolBar--bottom',
) as HTMLElement
if (fixedBarBottom) {
  bartender.addPushElement(fixedBarBottom, {
    positions: ['left', 'bottom'],
  })
}

const toggleButtons = document.querySelectorAll('.toggleButton')
for (const button of Array.from(toggleButtons)) {
  button.addEventListener('click', () => {
    bartender.toggle(button.getAttribute('data-bar') || '')
  })
}

const closeButtons = document.querySelectorAll('.closeButton')
for (const button of Array.from(closeButtons)) {
  button.addEventListener('click', () => {
    bartender.close()
  })
}

const spamToggle = document.querySelector('.spamToggle')
spamToggle?.addEventListener('click', () => {
  // Get array of bars in random order
  const barStack = Array.from({ length: 10 }, () => {
    return bartender.bars[Math.floor(Math.random() * bartender.bars.length)]
  })

  console.table(barStack)

  for (const bar of barStack) {
    bartender.toggle(bar.name)
  }

  bartender.close()
})

const spamOpen = document.querySelector('.spamOpen')
spamOpen?.addEventListener('click', () => {
  // Get array of bars in random order
  const barStack = Array.from({ length: 10 }, () => {
    return bartender.bars[Math.floor(Math.random() * bartender.bars.length)]
  })

  console.table(barStack)

  for (const bar of barStack) {
    bartender.open(bar.name)
  }

  bartender.close()
})
