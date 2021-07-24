
import Home from './views/Home.vue'
import Simple from './views/Simple.vue'
import Params from './views/Params.vue'
import Search from './views/Search.vue'
import SearchSet from './views/SearchSet.vue'
import Reload from './views/Reload.vue'
import ThrowError from './views/ThrowError.vue'
import Delayed from './views/Delayed.vue'
import DelayedBeforeEach from './views/DelayedBeforeEach.vue'
import Error from './views/Error.vue'
import NotFound from './views/NotFound.vue'


export default [
  { path: '/', component: Home },
  { path: '/simple', component: Simple },
  { path: '/params/:foo', component: Params },
  { path: '/search', component: Search },
  { path: '/search-set', component: SearchSet },
  { path: '/reload', component: Reload },
  { path: '/throw-error', component: ThrowError },
  { path: '/delayed', component: Delayed },
  { path: '/delayed-before-each', component: DelayedBeforeEach },
  { path: '[error]', component: Error },
  { path: '*', component: NotFound },
]
