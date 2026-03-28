import { afterEach } from 'vitest'
import '../dist/bartender.css'

afterEach(() => {
  document.querySelectorAll('dialog').forEach((el) => {
    const dialog = el as HTMLDialogElement
    if (dialog.open) {
      dialog.close()
    }
    dialog.remove()
  })
  document.body.classList.remove(
    'bartender-ready',
    'bartender-open',
    'bartender-disable-scroll',
  )
})
