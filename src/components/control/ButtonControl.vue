<template>
  <button
    :type="type"
    :disabled="disabled"
    class="custom-button"
    @click="onClick"
    :style="buttonStyles"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, computed} from 'vue'
import {palette, spacing} from '@/css/theme'

// Define the component props
interface ButtonProps {
  label: string
  type?: 'button' | 'submit' | 'reset'
  variant: 'primary' | 'secondary'
  disabled?: boolean
}

// Define props with TypeScript
const props = defineProps<ButtonProps>()

// Emit click event
const emit = defineEmits(['click'])

// Default values for props
const type = props.type || 'button'
const disabled = computed(() => {
  return props.disabled || false
})
// Emit the click event
const onClick = (event: Event) => {
  if (!disabled.value) {
    emit('click', event)
  }
}

const buttonStyles = computed(() => ({
  backgroundColor:
    props.variant === 'primary' ? palette.accent : palette.background,
  borderColor: palette.border,
  color: palette.textOnPrimary,
  padding: `
    ${spacing(3)} ${spacing(5)}
  `,
  outline: 'none',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '4px',
  width: '100%',
  cursor: disabled.value ? 'not-allowed' : 'pointer',
}))
</script>
