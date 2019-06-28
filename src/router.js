
import isFunction from 'lodash/isFunction';
import cloneDeepWith from 'lodash/cloneDeepWith';
import pathToRegexp from 'path-to-regexp';
import url from 'url';


let $route, $router;


function initSearch(search) {
  return {
    ...search,
    get(key) {
      return this[key] || '';
    },
  };
}


function initRoutes(routes) {
  return routes.map(route => {
    if (route.redirect) {
      route.component = {
        render(h) {
          return h();
        },

        afterNavigate() {
          let dest = route.redirect;
          Object.keys($route.params).forEach(key => {
            dest = dest.replace(`:${key}`, $route.params[key]);
          });

          $router.navigate(dest);
        },
      };
    }

    if (route.path === '*') {
      route.regexp = new RegExp(/.+/);
    } else if (route.path !== '[error]') {
      route.keys = [];
      route.regexp = pathToRegexp(route.path, route.keys, {sensitive: true});
      route.keys = route.keys.map(key => key.name);
    }

    // Notify every view instance initialization to the router.
    route.component.beforeCreate = function() {
      if (this.$vnode && this.$vnode.data.viewComponent) {
        $router.$$loadingInstance = this;
      }
    };

    return route;
  });
}


function matchRoute(routes, path) {
  let u = url.parse(path, true, true);
  path = u.pathname;

  for (let route of routes) {
    if (!route.regexp) {
      continue;
    }

    let match = path.match(route.regexp);
    if (match) {
      let params = {};
      match.forEach((param, index) => {
        if (index === 0) {
          return;
        }
        params[route.keys[index - 1]] = param;
      });

      return {
        route,
        path,
        params,
        search: u.query,
      };
    }
  }

  throw new Error(`route not found: ${path}`);
}


function loadRoute(Vue, routes, match, afterHooks) {
  if ($router.isLoading) {
    return;
  }

  $route.path = match.path;
  $route.params = match.params;
  $route.search = initSearch(match.search);

  $router.isLoading = true;

  // Mount a new component instance everytime even when we are reloading the
  // same route again. This is one of the big differences with VueRouter.
  let component = cloneDeepWith(match.route.component, value => {
    if (isFunction(value)) {
      return value;
    }
  });
  $router.$$loadingComponent = component;
  $router.$$loadingInstance = null;
  
  Vue.nextTick(() => {
    Promise.resolve(true)
      .then(() => {
        if ($router.$$loadingComponent.navigate) {
          return $router.$$loadingComponent.navigate.call($router.$$loadingInstance);
        }
      })
      .then(() => {
        // Check the user is still trying to load this same component.
        if ($router.$$loadingComponent !== component) {
          return;
        }

        // Change to the new URL and move the scroll to the start of the page.
        if (location.pathname !== match.path) {
          window.scrollTo(0, 0);
          history.pushState(null, '', formatPath(match));
        }

        $router.isLoading = false;

        // Load the component in the viewport.
        $route.component = $router.$$loadingComponent;
        $router.$$loadingComponent = null;

        // Call any global hook for the router.
        afterHooks.forEach(hook => hook($route));

        if ($route.component.afterNavigate) {
          setTimeout(() => $route.component.afterNavigate.call($router.$$loadingInstance));
        }
      })
      .catch(err => {
        // Check the user is still trying to load this same component.
        if ($router.$$loadingComponent !== component) {
          return Promise.reject(err);
        }

        $router.isLoading = false;

        // Even if it fails we have a special component for it; we go ahead
        // and load it and change the URL so the user can reload easily.
        if (location.pathname !== match.path) {
          window.scrollTo(0, 0);
          history.pushState(null, '', formatPath(match));
        }

        // Load the error page.
        let error = routes.find(r => r.path === '[error]');
        $route.component = error ? error.component : undefined;
        $route.lastException = err;
        $router.$$loadingComponent = null;

        // Call any global hook for the router.
        afterHooks.forEach(hook => hook($route));

        return Promise.reject(err);
      });
  });
}


function formatPath(match) {
  let u = url.parse(match.path, true, true);
  delete u.search;
  u.query = match.search;
  return u.format(u);
}


export function createRouter(Vue, {context, prefix, routes}) {
  routes = routes.map(route => {
    if (!route.component) {
      return route;
    }

    return {
      ...route,
      component: context(`${prefix}/${route.component}.js`).default,
    };
  });

  $route = Vue.observable({
    path: '',
    component: null,
    instance: null,
    params: {},
    search: initSearch({}),
  });
  $router = Vue.observable({
    isLoading: false,
  });
  Vue.prototype.$route = $route;
  Vue.prototype.$router = $router;

  Vue.$router = $router;

  // Prepare all the RegExps for matching routes.
  routes = initRoutes(routes);

  // Methods to add new hooks to the router.
  let afterHooks = [];
  $router.afterRouteChange = hook => {
    afterHooks.push(hook);
    return () => {
      afterHooks.splice(afterHooks.indexOf(hook), 1);
    };
  };

  let navigateHooks = [];
  $router.beforeNavigate = hook => {
    navigateHooks.push(hook);
    return () => {
      navigateHooks.splice(navigateHooks.indexOf(hook), 1);
    };
  };

  // Navigate helper for links and redirections.
  $router.navigate = u => {
    for (let hook of navigateHooks) {
      u = hook(u);
    }

    let match = matchRoute(routes, u);
    loadRoute(Vue, routes, match, afterHooks);
  };

  // When the user changes the route we change the component too.
  window.addEventListener('popstate', () => $router.navigate(location.pathname + location.search));

  // Start the navigation in the first route we have.
  Vue.nextTick(() => $router.navigate(location.pathname + location.search));

  return $router;
}
