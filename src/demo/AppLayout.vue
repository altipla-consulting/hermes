
<template>
  <div class="mx-auto max-w-5xl my-8">
    <div class="uppercase font-bold text-center text-2xl">Before router view. Loads: {{value}}</div>
    <hr class="border-gray-300 mt-4 mb-8">

    <router-view></router-view>
    
    <hr class="border-gray-300 mt-8 mb-4">
    <div class="uppercase font-bold text-center text-2xl">After router view. Loads: {{value}}</div>
  </div>
</template>

<script>
let value = 0

export default {
  name: 'app-layout',

  data() {
    value++

    return {
      value,
    }
  },
}
</script>
