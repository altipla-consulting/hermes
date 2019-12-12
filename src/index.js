
import RouterLink from './components/router-link';
import RouterView from './components/router-view';

import { createRouter } from './router';


export default {
  install(Vue, options) {
    Vue.component('router-link', RouterLink);
    Vue.component('router-view', RouterView);

    createRouter(Vue, options);
  }
}
