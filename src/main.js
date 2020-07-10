
import { createApp } from 'vue'

import Hermes from './lib'

import routes from './test/routes'
import AppLayout from './test/AppLayout.vue'


let app = createApp(AppLayout)
app.use(Hermes, { routes })
app.mount('#app')
