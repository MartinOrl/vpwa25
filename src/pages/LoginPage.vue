<template>
  <div
    :style="{
      maxWidth: containers.login,
      height: '100vh',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }"
  >
    <div
      :style="{
        padding: `
        ${spacing(6)} ${spacing(4)} ${spacing(4)} ${spacing(4)}
      `,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing(3),
      }"
    >
      <h1
        :style="{
          color: palette.textOnPrimary,
          fontSize: '2.5rem',
          fontWeight: 700,
          textAlign: 'center',
          margin: `
            0 auto ${spacing(3)}
          `,
          lineHeight: '1',
        }"
      >
        HuddleHub
      </h1>
      <QInputComponent
        v-model="form.email"
        label="Enter your email"
        type="text"
        :errorMessage="''"
        :validationRules="validationRules"
        outlined
        clearable
        dense
      />
      <QInputComponent
        v-model="form.password"
        label="Enter your password"
        type="password"
        :errorMessage="''"
        :validationRules="validationRules"
        outlined
        clearable
        dense
      />
      <ButtonControl
        label="Login"
        variant="primary"
        @click="login"
        :disabled="!isFormValid"
      />
      <p
        :style="{
          color: palette.textOpaque,
          textAlign: 'center',
        }"
      >
        Don't have an account?
        <a
          :style="{
            color: palette.accent,
            textDecoration: 'none',
          }"
          href="/auth/register"
          >Register</a
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, defineComponent, reactive} from 'vue'
import ButtonControl from '@/components/control/ButtonControl.vue'
import QInputComponent from '@/components/input/QInput.vue'
import {containers, spacing, palette} from '@/css/theme'

// Reactive state for input
const form = reactive({
  email: '',
  password: '',
})

const isFormValid = computed(() => form.email !== '' && form.password !== '')

// Validation rules array
const validationRules = [
  (value: string) => !!value || 'Field is required', // Required field rule
  (value: string) => value.length >= 3 || 'Minimum 3 characters', // Minimum length rule
]

const login = () => {
  console.log('Login clicked')
}

defineComponent({
  components: {
    QInputComponent,
  },
  setup() {
    return {
      form,
      validationRules,
      containers,
      palette,
      spacing,
    }
  },
})
</script>
