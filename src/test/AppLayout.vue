
<template>
  <div>
    <h1>Before router view</h1>
    <hr>
    <router-view></router-view>
    <hr>
    <h1>After router view</h1>
  </div>
</template>

<script>
export default {
  name: 'app-layout',
}
</script>
