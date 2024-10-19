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
        v-model="form.firstName"
        label="Enter your first name"
        type="text"
        :errorMessage="''"
        :validationRules="getValidationRules('firstName')"
        outlined
        clearable
        dense
      />

      <QInputComponent
        v-model="form.lastName"
        label="Enter your last name"
        type="text"
        :errorMessage="''"
        :validationRules="getValidationRules('lastName')"
        outlined
        clearable
        dense
      />

      <QInputComponent
        v-model="form.nickName"
        label="Enter your nickname"
        type="text"
        :errorMessage="''"
        :validationRules="getValidationRules('nickName')"
        outlined
        clearable
        dense
      />

      <QInputComponent
        v-model="form.email"
        label="Enter your email"
        type="text"
        :errorMessage="''"
        :validationRules="getValidationRules('email')"
        outlined
        clearable
        dense
      />

      <QInputComponent
        v-model="form.password"
        label="Enter your password"
        type="password"
        :errorMessage="''"
        :validationRules="getValidationRules('password')"
        outlined
        clearable
        dense
      />

      <ButtonControl
        label="Register"
        variant="primary"
        @click="handleRegister"
        :disabled="!isFormValid"
      />
      <p
        :style="{
          color: palette.textOpaque,
          textAlign: 'center',
        }"
      >
        Already have an account?
        <a
          :style="{
            color: palette.accent,
            textDecoration: 'none',
          }"
          href="/auth/login"
          >Login</a
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ButtonControl from '@/components/control/ButtonControl.vue'
import QInputComponent from '@/components/input/QInput.vue'
import { containers, spacing, palette } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { ValidationRule } from '@/utils/types/misc'
import { UserStatus } from '@/utils/types/user'
const router = useRouter()
const { login } = useAuthStore()

// Reactive state for input
const form = reactive({
  firstName: '',
  lastName: '',
  nickName: '',
  email: '',
  password: '',
})

const isFormValid = computed(
  () =>
    form.firstName !== '' &&
    form.lastName !== '' &&
    form.nickName !== '' &&
    form.email !== '' &&
    form.password !== '',
)

// Validation rules array
const validationRules = [
  (value: string) => !!value || 'Field is required', // Required field rule
  (value: string) => value.length >= 3 || 'Minimum 3 characters', // Minimum length rule
]

const emailValidation = (value: string) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return emailRegex.test(value) || 'Invalid email'
}

const getValidationRules = (value: string) => {
  const rules: ValidationRule[] = [...validationRules]
  if (value === 'email') {
    rules.push(emailValidation)
  }
  return rules
}

const handleRegister = () => {
  login(
    {
      email: form.email,
      name: 'Joe',
      nickName: 'Joe',
      surname: 'Mama',
      status: UserStatus.ONLINE,
      image: 'https://randomuser.me/api/portraits/thumb/men/18.jpg',
    },
    'forcelogin',
  )
  router.push('/chat')
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
