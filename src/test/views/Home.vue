
<template>
  <div>
    <h1>Home View</h1>
    <p>Go to: <router-link to="/simple">Simple View</router-link></p>
    <p>Go to: <router-link to="/params/foo">Params View</router-link></p>
    <p>Go to: <router-link to="/search?foo=2&bar=qux">Search View</router-link></p>
    <p>Go to: <router-link to="/reload">Reload View</router-link></p>
    <p>Go to: <router-link to="/throw-error">Throw Error View</router-link></p>
    <p>Go to: <router-link to="/throw-not-found">Throw Not Found View</router-link></p>
    <p>Go to: <router-link to="/delayed">Delayed View</router-link></p>
  </div>
</template>

<script>
export default {
}
</script>
