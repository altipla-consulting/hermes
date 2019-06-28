
import Vue from 'vue';

import Hermes from '../src/index';


Vue.use(Hermes, {
  prefix: './views',
  context: require.context('.', true, /^\.\/views\/.+\.js$/),
  routes: [
    {path: '/', component: 'home'},
    {path: '/simple', component: 'simple'},
    {path: '/params/:foo', component: 'params'},
    {path: '/search', component: 'search'},
    {path: '/reload', component: 'reload'},
    {path: '/throw-error', component: 'throw-error'},
    {path: '/delayed', component: 'delayed'},
    {path: '[error]', component: 'error'},
    {path: '*', component: 'not-found'},
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

