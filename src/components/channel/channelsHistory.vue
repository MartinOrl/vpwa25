<template>
  <div
    :style="{
      display: 'flex',
      alignItems: 'center',
      gap: spacing(2),
    }"
  >
    <q-btn dense flat>
      <q-icon name="arrow_back" color="white" size="1.25rem" />
    </q-btn>
    <q-btn dense flat>
      <q-icon name="arrow_forward" color="white" size="1.25rem" />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { spacing } from '@/css/theme'
</script>
