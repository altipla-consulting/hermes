
export default {
  template: `
    <div>
      <p>Home View</p>
      <p>Go to: <router-link to="/test/simple">Simple View</router-link></p>
      <p>Go to: <router-link to="/test/params/foo">Params View</router-link></p>
      <p>Go to: <router-link to="/test/search?foo=2&bar=qux">Search View</router-link></p>
      <p>Go to: <router-link to="/test/reload">Reload View</router-link></p>
      <p>Go to: <router-link to="/test/throw-error">Throw Error View</router-link></p>
    </div>
  `,
}
