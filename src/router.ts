
import { reactive, nextTick, markRaw, Component, ComponentPublicInstance } from 'vue'
import { isFunction, cloneDeepWith } from 'lodash-es'
import { Key, pathToRegexp } from 'path-to-regexp'

import makeRedirector from './components/redirector'


export type ComponentNavigate = Component & {
  navigate?: (this: ComponentPublicInstance) => Promise<void> | void
}

export interface RouteDeclaration {
  path: string
  component?: ComponentNavigate
  redirect?: string
}

type ProcessedRouteDeclaration = RouteDeclaration & {
  keys: string[]
  regexp: RegExp
}

export type Transformer = (url: string) => string
export type BeforeEachHook = (to: ComponentPublicInstance) => Promise<boolean> | void | Promise<void>

export interface PluginOptions {
  routes: RouteDeclaration[]
  transformers?: Transformer[]
  beforeEach?: BeforeEachHook
}

export class Router {
  constructor(
    private route: Route,
    private routes: ProcessedRouteDeclaration[],
    private transformers: Transformer[] = [],
    private beforeEach: BeforeEachHook | undefined
  ) {}

  navigate(url: string) {    
    window.scrollTo(0, 0)
    
    url = this.transformLink(url)
    
    let error = this.routes.find(r => r.path === '[error]')

    let { path, params, search, decl } = this.matchRoute(url)

    // Mount a new component instance everytime even when we are reloading the
    // same route again. This is one of the big differences with VueRouter.
    let component = markRaw<ComponentNavigate>(cloneDeepWith(decl.component, value => {
      if (isFunction(value)) {
        return value
      }
    }))

    this.route.path = path
    this.route.params = params
    this.route.search = search
    this.route.isLoading = true
    this.route.loadingComponent = component

    nextTick(async () => {
      if (this.route.loadingComponent?.navigate || this.beforeEach) {
        try {
          // Call both hooks or the one that is defined in the configuration.
          await this.beforeEach?.call(null, this.route.loadingInstance as ComponentPublicInstance)
          await this.route.loadingComponent?.navigate?.call(this.route.loadingInstance as ComponentPublicInstance)
        } catch (err) {
          // Check the user is still trying to load this same component.
          if (this.route.loadingComponent !== component) {
            return
          }

          // Even if it fails we have a special component for it; we go ahead
          // and load it and change the URL so the user can reload easily.
          if (location.pathname !== path) {
            history.pushState(null, '', this.formatMatch(path, search))
          }

          // Load the error page.
          this.route.component = error ? markRaw<ComponentNavigate>(error.component as ComponentNavigate) : null
          this.route.lastException = err
          this.route.loadingComponent = null
          this.route.isLoading = false

          throw err
        }
      }

      // Check the user is still trying to load this same component.
      if (this.route.loadingComponent !== component) {
        return
      }

      // Change to the new URL if it's different
      let current = `${location.pathname}${location.search}`
      let expected = this.formatMatch(path, search)
      if (current !== expected) {
        history.pushState(null, '', expected)
      }

      this.route.isLoading = false
      this.route.component = component
      this.route.loadingComponent = null
    })
  }

  private matchRoute(path: string) {
    let url = new URL(path, 'https://w.w')

    for (let decl of this.routes) {
      if (!decl.regexp) {
        continue
      }

      let match = url.pathname.match(decl.regexp)
      if (match) {
        let params: {[key: string]: any} = {}
        match.forEach((param, index) => {
          if (index === 0) {
            return
          }
          params[decl.keys[index - 1]] = param
        })

        let search: { [key: string]: any } = {}
        for (let [key, value] of url.searchParams) {
          search[key] = value
        }

        return {
          decl,
          params,
          search,
          path: url.pathname,
        }
      }
    }

    throw new Error(`route not found: ${url.pathname}`)
  }

  private formatMatch(path: string, search: {[key: string]: any}) {
    let url = new URL(path, 'https://w.w')

    let p = new URLSearchParams()
    for (let [key, value] of Object.entries(search)) {
      p.set(key, value)
    }
    let qs = p.toString()
    url.search = qs ? `?${qs}` : ''

    return url.toString().substring('https://w.w'.length)
  }
  
  pushHistory(url: string) {
    history.pushState(null, '', url)
  }

  reload() {
    this.navigate(location.pathname + location.search)
  }

  transformLink(url: string) {
    for (let hook of this.transformers) {
      url = hook(url)
    }
    return url
  }
}

export interface Route {
  path: string,
  search: { [key: string]: any }
  params: { [key: string]: any }
  lastException: Error | null
  isLoading: boolean

  // Internal use to track the active component
  loadingComponent: ComponentNavigate | null
  loadingInstance: ComponentPublicInstance | undefined
  component: ComponentNavigate | null
}

export type ComponentNavigateHMR = ComponentNavigate & {
  // Filled by Vite when using HMR.
  __hmrId?: string
}

function shouldNavigateHMR(stale: ComponentNavigate | undefined, def: ComponentNavigate) {
  // The component is not a view.
  if (!stale) {
    return false
  }

  // One of them has a navigate and the other don't. Full reload.
  if ((stale.navigate && !def.navigate) || (!stale.navigate && def.navigate)) {
    return true
  }

  // Navigate function change.
  if (stale.navigate && def.navigate) {
    return true
  }

  // A different code change, let Vite reload itself.
  return false
}

export function createRouter({ routes, transformers, beforeEach }: PluginOptions) {
  let processedRoutes = routes.map(r => {
    let route = r as ProcessedRouteDeclaration

    if (route.path === '*') {
      route.regexp = new RegExp(/.+/)
    } else if (route.path !== '[error]') {
      let keys: Key[] = []
      route.regexp = pathToRegexp(route.path, keys, { sensitive: true })
      route.keys = keys.map(key => key.name as string)
    }

    if (route.redirect) {
      route.component = makeRedirector(route.redirect, route.keys)
    }

    return route
  })

  let route = reactive<Route>({
    path: '',
    params: {},
    search: {},

    lastException: null,

    isLoading: false,

    loadingComponent: null,
    loadingInstance: undefined,
    component: null,
  })

  let router = new Router(route, processedRoutes, transformers, beforeEach)

  // When the user changes the route we change the component too.
  window.addEventListener('popstate', () => router.reload())

  // Start the navigation in the first route we are currently in.
  nextTick(() => router.reload())

  // Patch Hot Module Replacement to reload the view when the component changes.
  if (window.__VUE_HMR_RUNTIME__) {
    let reload = window.__VUE_HMR_RUNTIME__.reload
    window.__VUE_HMR_RUNTIME__.reload = function(id: string, def: Component) {
      let stale: ComponentNavigate | undefined = undefined
      if (route.component && (route.component as ComponentNavigateHMR).__hmrId === id) {
        stale = route.component
      }
      if (route.loadingComponent && (route.loadingComponent as ComponentNavigateHMR).__hmrId === id) {
        stale = route.loadingComponent
      }
      if (shouldNavigateHMR(stale, def)) {
        route.component = null
        let active = routes.find(r => r.component && (r.component as ComponentNavigateHMR).__hmrId === id)
        if (active) {
          active.component = def
        }
        router.reload()
      } else {
        reload.call(this, id, def)
      }
    }
  }

  return { router, route }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    router: Router
    route: Route
  }
}
