
import { reactive, nextTick, markRaw, h } from 'vue'
import { isFunction, cloneDeepWith } from 'lodash-es'
import { pathToRegexp } from 'path-to-regexp'


function initRoutes(routes) {
  return routes.map(route => {
    if (route.redirect) {
      route.component = {
        render() {
          return h('div')
        },

        navigate() {
          let dest = route.redirect
          route.keys.forEach(key => {
            dest = dest.replace(`:${key}`, this.route.params[key])
          })

          this.router.navigate(dest)
        },
      }
    }

    if (route.path === '*') {
      route.regexp = new RegExp(/.+/)
    } else if (route.path !== '[error]') {
      let keys = []
      route.regexp = pathToRegexp(route.path, keys, { sensitive: true })
      route.keys = keys.map(key => key.name)
    }

    return route
  })
}


async function loadRoute(error, route, match) {
  // Mount a new component instance everytime even when we are reloading the
  // same route again. This is one of the big differences with VueRouter.
  let component = markRaw(cloneDeepWith(match.route.component, value => {
    if (isFunction(value)) {
      return value
    }
  }))

  route.path = match.path
  route.params = match.params
  route.search = match.search
  route.isLoading = true
  route.loadingComponent = component

  nextTick(async () => {
    if (route.loadingComponent.navigate) {
      try {
        await route.loadingComponent.navigate.call(route.loadingInstance)
      } catch (err) {
        // Check the user is still trying to load this same component.
        if (route.loadingComponent !== component) {
          return
        }

        // Even if it fails we have a special component for it; we go ahead
        // and load it and change the URL so the user can reload easily.
        if (location.pathname !== match.path) {
          history.pushState(null, '', formatMatch(match))
        }

        // Load the error page.
        route.component = error ? markRaw(error.component) : null
        route.lastException = err
        route.loadingComponent = null
        route.isLoading = false

        throw err
      }
    }

    // Check the user is still trying to load this same component.
    if (route.loadingComponent !== component) {
      return
    }

    // Change to the new URL if it's different
    let current = `${location.pathname}${location.search}`
    let expected = formatMatch(match)
    if (current !== expected) {
      history.pushState(null, '', expected)
    }

    route.isLoading = false
    route.component = component
    route.loadingComponent = null
  })
}


function matchRoute(routes, path) {
  let url = new URL(path, 'https://w.w')

  for (let route of routes) {
    if (!route.regexp) {
      continue
    }

    let match = url.pathname.match(route.regexp)
    if (match) {
      let params = {}
      match.forEach((param, index) => {
        if (index === 0) {
          return
        }
        params[route.keys[index - 1]] = param
      })

      let search = {}
      for (let [key, value] of url.searchParams) {
        search[key] = value
      }

      return {
        route,
        params,
        search,
        path: url.pathname,
      }
    }
  }

  throw new Error(`route not found: ${url.pathname}`)
}


function formatMatch(match) {
  let url = new URL(match.path, 'https://w.w')

  let search = new URLSearchParams()
  for (let [key, value] of Object.entries(match.search)) {
    search.set(key, value)
  }
  search = search.toString()
  url.search = search ? `?${search}` : ''

  return url.toString().substring('https://w.w'.length)
}


function transformLink(hooks, url) {
  for (let hook of hooks) {
    url = hook(url)
  }
  return url
}


function shouldNavigate(stale, def) {
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


export function createRouter({ routes, transformers = [] }) {
  routes = initRoutes(routes)
  let error = routes.find(r => r.path === '[error]')

  let route = reactive({
    path: '',
    params: {},
    search: {},

    lastException: null,

    isLoading: false,

    loadingComponent: null,
    loadingInstance: null,
    component: null,
  })

  let router = {
    navigate(url) {
      window.scrollTo(0, 0)
      
      url = transformLink(transformers, url)
      loadRoute(error, route, matchRoute(routes, url))
    },

    pushHistory(url) {
      history.pushState(null, '', url)
    },

    reload() {
      this.navigate(location.pathname + location.search)
    },

    transformLink(url) {
      return transformLink(transformers, url)
    },
  }

  // When the user changes the route we change the component too.
  window.addEventListener('popstate', () => router.reload())

  // Start the navigation in the first route we are currently in.
  nextTick(() => router.reload())

  // Patch Hot Module Replacement to reload the view when the component changes.
  if (window.__VUE_HMR_RUNTIME__) {
    let reload = window.__VUE_HMR_RUNTIME__.reload
    window.__VUE_HMR_RUNTIME__.reload = function(id, def) {
      let stale
      if (route.component && route.component.__hmrId === id) {
        stale = route.component
      }
      if (route.loadingComponent && route.loadingComponent.__hmrId === id) {
        stale = route.loadingComponent
      }
      if (shouldNavigate(stale, def)) {
        route.component = null
        routes.find(r => r.component.__hmrId === id).component = def
        router.reload()
      } else {
        reload.call(this, id, def)
      }
    }
  }

  return { router, route }
}
