
import { h, watch } from 'vue'
import { useRouter } from '../use-api'


export default {
  name: 'router-link',

  props: {
    to: {
      type: String,
      required: true,
    },
  },

  setup(props, { slots }) {
    let router = useRouter()
    
    function onClick($event) {
      if (!$event.ctrlKey) {
        $event.preventDefault()
        router.navigate(href)
      }
    }
    
    let href = router.transformLink(props.to)
    watch(() => props.to, () => {
      href = router.transformLink(props.to)
    })

    return () => {
      return h('a', { href, onClick }, [slots.default()])
    }
  },
}
