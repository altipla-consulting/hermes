
import { readonly, Plugin, App } from 'vue'

import RouterView from '/components/router-view'
import RouterLink from '/components/router-link'

import { createRouter, PluginOptions } from './router'
import { install, useRouter, useRoute } from './use-api'


export default {
  install(app: App, options: PluginOptions) {
    let { router, route } = createRouter(options)

    install(app, router, route)

    app.config.globalProperties.router = router
    app.config.globalProperties.route = readonly(route)

    app.component('router-view', RouterView)
    app.component('router-link', RouterLink)
  },
} as Plugin


export { useRoute, useRouter }
