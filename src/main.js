
import RouterView from './components/router-view'
import RouterLink from './components/router-link'

import { createRouter } from './router'
import { install } from './use-api'


export default {
  install(app, options) {
    let { router, route } = createRouter(options)

    install(app, router, route)
    app.mixin({
      data() {
        return {
          router,
          route: { ...route },
        }
      },
    })

    app.component('router-view', RouterView)
    app.component('router-link', RouterLink)
  },
}
