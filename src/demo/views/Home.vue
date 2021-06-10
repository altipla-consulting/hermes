
<template>
  <h1 class="text-xl font-medium my-4">Home View</h1>
  <p><router-link to="/simple">Simple View</router-link></p>
  <p><router-link to="/params/foo">Params View</router-link></p>
  <p><router-link to="/search?foo=2&bar=qux">Search View</router-link></p>
  <p><router-link to="/search-set">Search Set View</router-link></p>
  <p><router-link to="/reload">Reload View</router-link></p>
  <p><router-link to="/throw-error">Throw Error View</router-link></p>
  <p><router-link to="/throw-not-found">Throw Not Found View</router-link></p>
  <p><router-link to="/delayed">Delayed View</router-link></p>
</template>

<script>
export default {
}
</script>
