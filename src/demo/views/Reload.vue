
<template>
  <h1 class="text-xl font-medium my-4">Reload View</h1>
  <p><router-link to="/reload">Reload again</router-link> this view</p>
  <p>Reloads: {{reloads}}</p>
  <h4 class="mt-16 font-medium">Back: <router-link to="/">Home View</router-link></h4>
</template>

<script>
let reloads = 0
  

export default {
  data() {
    return {
      reloads,
    }
  },

  mounted() {
    reloads++
  },
}
</script>
