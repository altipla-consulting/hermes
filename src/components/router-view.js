
import { h, ref } from 'vue'

import { useRoute } from '../use-api'


export default {
  name: 'router-view',
  setup() {
    let route = useRoute()
    let viewRef = ref()

    return () => {
      let component
      if (route.component) {
        component = h(route.component)
      }

      if (route.loadingComponent) {
        component = h(
          route.loadingComponent,
          {
            ref: viewRef,
            onVnodeMounted() {
              route.loadingInstance = viewRef.value
            },
          },
        )
      }

      return h('main', null, component)
    }
  },
}
