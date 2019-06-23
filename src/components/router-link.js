
export default {
  name: 'router-link',

  props: {
    to: {
      type: String,
      required: true,
    },
  },

  render(createElement) {
    return createElement('a', {
      attrs: {
        href: this.to,
      },
      on: {
        click: this.navigate,
      },
    }, this.$slots.default);
  },

  methods: {
    navigate($event) {
      if (!$event.ctrlKey) {
        $event.preventDefault();
        this.$router.navigate(this.to);
      }
    },
  },
};
