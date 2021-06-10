
<template>
  <h1 class="text-xl font-medium my-4">Search Set View</h1>
  <p>Set the search parameters from an external view with the JS API</p>
  <button
    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-6"
    @click="setSearch"
  >Navigate to search view</button>
  <h4 class="mt-16 font-medium">Back: <router-link to="/">Home View</router-link></h4>
</template>

<script>
export default {
  methods: {
    setSearch() {
      this.router.navigate('/search?foo=1&bar=2&qux=str')
    },
  },
}
</script>
