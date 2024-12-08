<template>
  <router-view />
</template>

<script setup lang="ts">
window.addEventListener('online', () => {
  console.log('App is online')
})

window.addEventListener('offline', () => {
  console.log('App is offline')
})

defineOptions({
  name: 'App',
})
</script>
