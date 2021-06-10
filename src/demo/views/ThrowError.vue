
<template>
  <h1 class="text-xl font-medium my-4">Throw Error View</h1>
</template>

<script>
export default {
  async navigate() {
    throw new Error('foo error')
  },
}
</script>
