
import { defineComponent, h, watch } from 'vue'

import { useRouter } from '../use-api'
import { Router } from '../router'


export default defineComponent({
  name: 'router-link',

  props: {
    to: {
      type: String,
      required: true,
    },
  },

  setup(props, { slots }) {
    let router = useRouter()
    if (!router) {
      throw new Error(`Cannot use <router-link> without a configured router. Install the Hermes plugin.`)
    }
    
    function onClick($event: KeyboardEvent) {
      router = router as Router
      if (!$event.ctrlKey) {
        $event.preventDefault()
        router.navigate(href)
      }
    }
    
    let href = router.transformLink(props.to)
    watch(() => props.to, () => {
      router = router as Router
      href = router.transformLink(props.to)
    })

    return () => {
      return h('a', { href, onClick }, [slots.default && slots.default()])
    }
  },
})
