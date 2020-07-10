
<template>
  <div>
    <h1>Throw Error View</h1>
  </div>
</template>

<script>
export default {
  async navigate() {
    throw new Error('foo error')
  },
}
</script>
