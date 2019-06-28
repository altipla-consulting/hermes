
import Vue from 'vue';

import Hermes from '../src/index';


Vue.use(Hermes, {
  prefix: './views',
  context: require.context('.', true, /^\.\/views\/.+\.js$/),
  routes: [
    {path: '/test/', component: 'home'},
    {path: '/test/simple', component: 'simple'},
    {path: '/test/params/:foo', component: 'params'},
    {path: '/test/search', component: 'search'},
    {path: '/test/reload', component: 'reload'},
    {path: '/test/throw-error', component: 'throw-error'},
    {path: '[error]', component: 'error'},
  ],
});


Vue.config.devtools = false;
Vue.config.productionTip = false;


let app = new Vue({
  template: `
    <div>
      <h1>Before router view</h1>
      <hr>
      <router-view></router-view>
      <hr>
      <h1>After router view</h1>
    </div>
  `,
});
app.$mount('#vue-mount');

