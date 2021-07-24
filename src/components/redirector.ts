
import { defineComponent, h } from 'vue'


export default function makeRedirector(target: string, keys: string[]) {
  return defineComponent({
    render() {
      return h('div')
    },

    navigate() {
      let dest = target
      keys.forEach(key => {
        dest = dest.replace(`:${key}`, this.route.params[key])
      })

      this.router.navigate(dest)
    },
  })
}

