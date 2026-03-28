import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createBartender } from './'
import '@fokke-/bartender.js/dist/bartender.css'

import App from './App.vue'
import Home from './views/Home.vue'
import RouteWithBar from './views/RouteWithBar.vue'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/route-with-bar',
      name: 'RouteWithBar',
      component: RouteWithBar,
    },
  ],
})

const bartender = createBartender({ debug: true })

app.use(router).use(bartender).mount('#app')
