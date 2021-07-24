
import { inject, App } from 'vue'

import { Router, Route } from './router'


const KEY_ROUTER = 'hermes-router'
const KEY_ROUTE = 'hermes-route'


export function install(app: App, router: Router, route: Route) {
  app.provide(KEY_ROUTER, router)
  app.provide(KEY_ROUTE, route)
}


export function useRouter(): Router {
  return inject<Router>(KEY_ROUTER) as Router
}


export function useRoute(): Route {
  return inject<Route>(KEY_ROUTE) as Route
}
