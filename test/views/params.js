
export default {
  template: `
    <div>
      <h1>Params View</h1>
      <p>{{fullParams}}</p>
      <h4>Back: <router-link to="/">Home View</router-link></h4>
    </div>
  `,

  computed: {
    fullParams() {
      return this.$route.params;
    },
  },
}
