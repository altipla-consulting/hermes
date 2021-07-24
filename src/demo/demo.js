
import { createApp } from 'vue'

import Hermes from '../lib.ts'

import routes from './routes'
import AppLayout from './AppLayout.vue'


let app = createApp(AppLayout)
app.use(Hermes, {
  routes,
  async beforeEach(to) {
    console.log('before each', to)

    if (to.delayBeforeEach) {
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  },
})
app.mount('#app')
