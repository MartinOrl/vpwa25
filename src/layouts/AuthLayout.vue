<template>
  <q-layout view="lHh Lpr lFf" :style="{background: palette.background}">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {defineComponent} from 'vue'
import {palette} from '@/css/theme'

defineOptions({
  name: 'AuthLayout',
})

defineComponent({
  setup() {
    return {
      palette,
    }
  },
})
</script>
