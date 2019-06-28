
<p align="center">
  <img src="docs/logo.png">
</p>

---

## Differences with `vue-router`

Things we improve:

- New lifecycle method `navigate()` that can return a Promise. The router will wait for that promise to be resolved before loading the view.
- Can enable a route when the `navigate` method fails to load an error screen.
- Hooks after a view is really loaded, after `navigate` finishes.
- Hooks to modify the URL before it is finally loaded in the page. They allow to add custom and permanent parameters to all routes, like a global tenant name or something like that.
- There is a single hook `navigate()` called every time the view is loaded, even if it's the same. No more separate `beforeRouteEnter` and `beforeRouteUpdate` with the same implementation copy pasted in different functions.


Things that remain the same:

- Same names for the components (`<router-view>` and `<router-link>`)
- Parameters and catch-all (aka not found) views the same as `vue-router`.
- It has the same `this.$route` and `this.$router` objects to control the routing though individual methods and properties may vary.


Things not implemented in this repo:

- No nested router views.
- No lazy loading of components.


## Usage example

In the [test](test) folder there is a complete working example. The main part of the code is the registration of this plugin:

```js
import Vue from 'vue';
import Hermes from '@altipla/hermes';

import routes from './routes';


Vue.use(Hermes, {
  // Prefix to add to each "component" in the routes.js file.
  prefix: './views',

  // Webpack context require to load all the files inside the views folder
  // to then use them as specified in the routes.js file.
  context: require.context('.', true, /^\.\/views\/.+\.js$/),

  // List of routes imported from routes.js.
  routes,
});
````


```js
export default [
  // This route will load ./views/home.js as the component of the view.
  {path: '/test/', component: 'home'},
  {path: '/test/simple', component: 'simple'},
  {path: '/test/params/:foo', component: 'params'},

  // This will be loaded in case the navigate() of a view fails.
  {path: '[error]', component: 'error'},

  // Not found catch-all route.
  {path: '*', component: 'not-found'},
]
````


Finally the view is the same as in `vue-router`, use a component without name:

```js
export default {
  template: `
    <div>
      <h1>Simple View</h1>
      <h4>Back: <router-link to="/test/">Home View</router-link></h4>
    </div>
  `,

  async navigate() {
    await myService.LoadAnything();
  },
}
```
