
export default {
  template: `
    <div>
      <h1>Error View</h1>
      <p>{{lastException}}</p>
      <h4>Back: <router-link to="/">Home View</router-link></h4>
    </div>
  `,

  computed: {
    lastException() {
      return this.$route.lastException;
    },
  },
}
