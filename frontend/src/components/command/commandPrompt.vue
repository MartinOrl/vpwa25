<template>
  <div :style="promptStyle">
    <p>Search</p>
    <q-icon
      name="search"
      size="1.25rem"
      :style="{
        color: palette.textOpaque,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { palette, containers, spacing } from '@/css/theme'

const promptStyle = computed<CSSProperties>(() => ({
  background: palette.background,
  maxWidth: containers.search,
  width: '100%',
  padding: `${spacing(2)} ${spacing(3)}`,
  borderRadius: spacing(2),
  marginLeft: spacing(6),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  cursor: 'pointer',
}))
</script>
