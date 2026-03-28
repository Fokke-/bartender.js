// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import { createBartender, BartenderBar } from '@fokke-/vue-bartender.js'
import '../../../packages/core/src/assets/bartender.scss'
import './style.css'
import BarConfig from '../components/BarConfig.vue'
import Playground from '../components/Playground.vue'
import TryItOut from '../components/TryItOut.vue'
import BasicLeftAlignedBar from '../components/BasicLeftAlignedBar.vue'
import CenteredDialog from '../components/CenteredDialog.vue'
import FullScreenBar from '../components/FullScreenBar.vue'
import CenteredFullScreenBar from '../components/CenteredFullScreenBar.vue'
import BarWithAnimation from '../components/BarWithAnimation.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    const bartender = createBartender({ debug: false })

    app.use(bartender)
    app.component('BartenderBar', BartenderBar)
    app.component('BarConfig', BarConfig)
    app.component('Playground', Playground)
    app.component('TryItOut', TryItOut)
    app.component('BasicLeftAlignedBar', BasicLeftAlignedBar)
    app.component('CenteredDialog', CenteredDialog)
    app.component('FullScreenBar', FullScreenBar)
    app.component('CenteredFullScreenBar', CenteredFullScreenBar)
    app.component('BarWithAnimation', BarWithAnimation)
    // ...
  },
} satisfies Theme
