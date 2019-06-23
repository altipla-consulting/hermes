
let reloads = 0;

export default {
  template: `
    <div>
      <h1>Reload View</h1>
      <p><router-link to="/test/reload">Reload again</router-link> this view</p>
      <p>Reloads: {{reloads}}</p>
      <h4>Back: <router-link to="/test/">Home View</router-link></h4>
    </div>
  `,

  data() {
    return {
      reloads,
    };
  },

  mounted() {
    reloads++;
  },
}
