
<template>
  <h1 class="text-xl font-medium my-4">Delayed View</h1>
  <p>route.isLoading: {{route.isLoading}}</p>
  <p v-for="msg in messages" :key="msg">{{msg}}</p>
  <h4 class="mt-16 font-medium">Back: <router-link to="/">Home View</router-link></h4>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
    }
  },

  navigate() {
    this.messages.push(`${(new Date()).toISOString()} navigate started`)
    return new Promise(resolve => {
      setTimeout(() => {
        this.messages.push(`${(new Date()).toISOString()} navigation finished`)
        resolve()
      }, 3000)
    })
  },
}
</script>
