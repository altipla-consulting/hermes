
import { h } from 'vue'
import { useRouter } from '../use-api'


export default {
  name: 'router-link',

  props: {
    to: {
      type: String,
      required: true,
    },
  },

  setup({ to }, { slots }) {
    let router = useRouter()
    let href = router.transformLink(to)

    function onClick($event) {
      if (!$event.ctrlKey) {
        $event.preventDefault()
        router.navigate(href)
      }
    }

    return () => {
      return h('a', { href, onClick }, [slots.default()])
    }
  },
}
