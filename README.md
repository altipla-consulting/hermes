
<p align="center">
  <img src="docs/logo.png">
</p>

---

## Install

```shell
npm i --save @altipla/hermes
```


## Differences with `vue-router`

Things we improve:

- New lifecycle method `navigate()` that can return a Promise. The router will wait for that promise to be resolved before loading the view.
- Can enable a route when the `navigate` method fails to load an error screen.
- Hooks after a view is really loaded, after `navigate` finishes.
- There is a single hook `navigate()` called every time the view is loaded, even if it's the same. No more separate `beforeRouteEnter` and `beforeRouteUpdate` with the same implementation copy pasted in different functions.


Things that remain the same:

- Same names for the components (`<router-view>` and `<router-link>`)
- Parameters and catch-all (aka not found) views the same as `vue-router`.
- It has the same `this.route` and `this.router` objects to control the routing though individual methods and properties may vary. They aren't prefixed by `$` though.


Things not implemented in this repo:

- No nested router views.
- No lazy loading of components.
- No global hooks.


## Usage example

In the [src/test](test) folder there is a complete working example. The main part of the code is the registration of this plugin in the [src/main.js](src/main.js) file:

```js
import { createApp } from 'vue'

import Hermes from '@altipla/hermes'

import routes from './test/routes'
import AppLayout from './test/AppLayout.vue'


let app = createApp(AppLayout)
app.use(Hermes, { routes })
app.mount('#app')
````


The routes file should by convention export the whole list of URLs registered in the application:

```js
import Home from './views/Home.vue'
import Simple from './views/Simple.vue'
import Params from './views/Params.vue'
import Search from './views/Search.vue'
import Reload from './views/Reload.vue'
import ThrowError from './views/ThrowError.vue'
import Delayed from './views/Delayed.vue'
import Error from './views/Error.vue'
import NotFound from './views/NotFound.vue'


export default [
  { path: '/', component: Home },
  { path: '/simple', component: Simple },
  { path: '/params/:foo', component: Params },
  { path: '/search', component: Search },
  { path: '/reload', component: Reload },
  { path: '/throw-error', component: ThrowError },
  { path: '/delayed', component: Delayed },
  { path: '[error]', component: Error },
  { path: '*', component: NotFound },
]
````


Finally the view is the same as in `vue-router`, use a component:

```vue
<template>
  <div>
    <h1>Simple View</h1>
    <h4>Back: <router-link to="/">Home View</router-link></h4>
  </div>
</template>

<script>
export default {
  async navigate() {
    await myService.LoadAnything();
  },
}
</script>
```


## Things you can do with this lib

#### Route params

```js
export default [
  { path: '/params/:foo', component: Params },
]
```

```vue
<template>
  <div>
    <h1>Params View</h1>
    <p>{{route.params}}</p>
    <h4>Back: <router-link to="/">Home View</router-link></h4>
  </div>
</template>

<script>
export default {
}
</script>
```


#### Programmatic navigation

```js
this.router.navigate('/myroute');
````


#### Composition API

```js
import { useRouter, useRoute } from '@altipla/hermes'


export default {
  setup() {
    let router = useRouter()
    let route = useRoute()

    ...
  },
}
```


#### Search parameters

If you access `/search?foo=bar` this view will show `bar` inside the paragraph:

```js
export default [
  { path: '/search', component: Search },
]
```

```vue
<template>
  <div>
    <h1>Search View</h1>
    <p>{{route.search}}</p>
    <h4>Back: <router-link to="/">Home View</router-link></h4>
  </div>
</template>

<script>
export default {
}
</script>
```
