import { type BartenderBarPosition } from './lib/types'
import { Bartender } from './lib/Bartender'
import './assets/bartender.scss'
import './assets/styles.scss'

declare global {
  interface Window {
    bartender: Bartender
  }
}

const bartender = new Bartender({ debug: true })
window.bartender = bartender

const dialogEls = document.querySelectorAll('dialog')
for (const el of Array.from(dialogEls)) {
  bartender.addBar(el.dataset.name || '', {
    el,
    position: el.dataset.position as BartenderBarPosition,
    modal: el.dataset.modal === 'true' ? true : false,
  })
}

const openButtons = document.querySelectorAll(
  '.openButton',
) as NodeListOf<HTMLButtonElement>
for (const button of Array.from(openButtons)) {
  button.addEventListener('click', () => {
    bartender.open(
      button.getAttribute('data-bar') || '',
      button.dataset.keepOtherBarsOpen === 'true' ? true : false,
    )
  })
}

const closeButtons = document.querySelectorAll(
  '.closeButton',
) as NodeListOf<HTMLButtonElement>
for (const button of Array.from(closeButtons)) {
  button.addEventListener('click', () => {
    bartender.close(button.dataset.bar)
  })
}

const openAll = document.querySelector('.openAll')
openAll?.addEventListener('click', async () => {
  console.table(bartender.bars)

  for (const bar of bartender.bars) {
    await bartender.open(bar.name, true)
  }
})

const toggleAll = document.querySelector('.toggleAll')
toggleAll?.addEventListener('click', async () => {
  console.table(bartender.bars)

  for (const bar of bartender.bars) {
    await bartender.toggle(bar.name, true)
  }
})
