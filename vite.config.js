
import { extendLibConfig } from '@altipla/vite-config'


export default extendLibConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'lodash-es'],
    },
  },
})
