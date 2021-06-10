
import { createApp } from 'vue'

import Hermes from '../lib'

import routes from './routes'
import AppLayout from './AppLayout.vue'


let app = createApp(AppLayout)
app.use(Hermes, { routes })
app.mount('#app')
