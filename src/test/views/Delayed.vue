
<template>
  <div>
    <h1>Delayed View</h1>
    <h4>Back: <router-link to="/">Home View</router-link></h4>
  </div>
</template>

<script>
export default {
  navigate() {
    console.log('navigate started')
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('navigation finished')
        resolve()
      }, 3000)
    })
  },
}
</script>
