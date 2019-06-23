
export default {
  template: `
    <div>
      <h1>Search View</h1>
      <p>{{fullSearch}}</p>
      <h4>Back: <router-link to="/test/">Home View</router-link></h4>
    </div>
  `,

  computed: {
    fullSearch() {
      return this.$route.search;
    },
  },
}
