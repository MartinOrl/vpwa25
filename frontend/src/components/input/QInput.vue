<template>
  <div class="input-wrapper">
    <input
      v-model="inputValue"
      :type="props.type"
      :placeholder="props.label"
      :style="inputStyles"
      class="custom-input"
      @input="onInput"
    />
    <div v-if="errorMessage" :style="errorStyles">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { palette, spacing } from '@/css/theme' // Import the palette object

// Define the component props
interface Props {
  modelValue: string
  label: string
  type: string
  validationRules?: Array<(value: string) => boolean | string>
}

// Define props
const props = defineProps<Props>()

// Emit event for v-model binding
const emit = defineEmits(['update:modelValue'])

// Reactive data
const inputValue = ref(props.modelValue)
const errorMessage = ref('')

// Watch for changes in the modelValue (v-model)
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal
  },
)

// Function to handle input changes and emit value
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  validateInput()
}

// Function to validate input based on validation rules
const validateInput = () => {
  if ((props.validationRules ?? []).length > 0) {
    const validationError = props.validationRules?.find(
      (rule) => rule(inputValue.value) !== true,
    )

    if (validationError) {
      const message = validationError(inputValue.value) as string
      errorMessage.value = message
    } else {
      errorMessage.value = ''
    }
  }
}

const errorStyles = computed(() => ({
  color: palette.error,
  fontSize: '12px',
  marginTop: spacing(1),
}))

// Compute styles dynamically based on the palette
const inputStyles = computed(() => ({
  backgroundColor: palette.background,
  borderColor:
    errorMessage.value && inputValue.value ? palette.error : palette.border,
  color: palette.textOnPrimary,
  padding: `
    ${spacing(3)} ${spacing(5)}

  `,
  outline: 'none',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '4px',
  width: '100%',
}))
</script>
