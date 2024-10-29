import { Bartender } from './lib/Bartender'
import './assets/bartender.scss'
import './assets/styles.scss'

declare global {
  interface Window {
    bartender: Bartender
  }
}

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

bartender.addBar('right-sub', {
  el: '.bar--right-sub',
  position: 'right',
})

bartender.addBar('top', {
  el: '.bar--top',
  position: 'top',
})

bartender.addBar('bottom', {
  el: '.bar--bottom',
  position: 'bottom',
})

const openButtons = document.querySelectorAll('.openButton')
for (const button of Array.from(openButtons) as HTMLButtonElement[]) {
  button.addEventListener('click', () => {
    bartender.open(button.getAttribute('data-bar') || '', {
      keepOtherBars: button.dataset.keepOtherBars === 'true' ? true : undefined,
      standardDialog:
        button.dataset.standardDialog === 'true' ? true : undefined,
    })
  })
}

const closeButtons = document.querySelectorAll('.closeButton')
for (const button of Array.from(closeButtons)) {
  button.addEventListener('click', () => {
    bartender.close()
  })
}

const openAll = document.querySelector('.openAll')
openAll?.addEventListener('click', async () => {
  console.table(bartender.bars)

  for (const bar of bartender.bars) {
    await bartender.open(bar.name, {
      keepOtherBars: true,
    })
  }
})

const toggleAll = document.querySelector('.toggleAll')
toggleAll?.addEventListener('click', async () => {
  console.table(bartender.bars)

  for (const bar of bartender.bars) {
    await bartender.toggle(bar.name, {
      keepOtherBars: true,
    })
  }
})
