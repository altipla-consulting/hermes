
import * as path from 'path'

import { extendLibConfig } from '@altipla/vite-config'


export default extendLibConfig({
  build: {
    lib: {
      entry: path.resolve(process.cwd(), 'src', 'lib.ts'),
    },
    rollupOptions: {
      external: ['vue', 'lodash-es'],
    },
  },
})
