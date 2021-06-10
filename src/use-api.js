
import { inject } from 'vue'


const KEY_ROUTER = 'hermes-router'
const KEY_ROUTE = 'hermes-route'


export function install(app, router, route) {
  app.provide(KEY_ROUTER, router)
  app.provide(KEY_ROUTE, route)
}


export function useRouter() {
  return inject(KEY_ROUTER)
}


export function useRoute() {
  return inject(KEY_ROUTE)
}
