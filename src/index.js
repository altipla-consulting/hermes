
import RouterLink from './components/router-link';
import RouterView from './components/router-view';

import { createRouter } from './router';


export default {
  install(Vue, options) {
    if (!options.prefix) {
      options.prefix = '.';
    }

    Vue.component('router-link', RouterLink);
    Vue.component('router-view', RouterView);

    createRouter(Vue, options);
  }
}
