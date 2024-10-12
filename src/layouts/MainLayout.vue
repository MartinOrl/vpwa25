<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          color="white"
          @click="toggleLeftDrawer"
        />

        <div :style="{color: palette.primary}">HuddleHub</div>

        <div>v0.1</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {defineComponent, ref} from 'vue'
import {palette} from '@/css/theme'

defineOptions({
  name: 'MainLayout',
})

defineComponent({
  setup() {
    return {
      palette,
    }
  },
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
