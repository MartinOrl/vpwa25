<template>
  <div :style="separatorStyles">
    <span :style="separatorDateAnnouncerStyles"> {{ dateReadable }} </span>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { palette, spacing } from '@/css/theme'

const props = defineProps<{
  date: Date
}>()

const dateReadable = computed(() => {
  return props.date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
})

const separatorStyles: CSSProperties = {
  width: '100%',
  height: '1px',
  background: palette.border,
  margin: `${spacing(8)} auto`,
  position: 'relative',
}

const separatorDateAnnouncerStyles: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: palette.secondary,
  padding: `${spacing(1.25)} ${spacing(5)}`,
  color: palette.textOpaque,
  border: `1px solid ${palette.border}`,
  borderRadius: spacing(4),
}
</script>
