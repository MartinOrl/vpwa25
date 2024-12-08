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
        label="Login"
        variant="primary"
        @click="handleLogin"
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
import { computed, defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/boot/axios'
import ButtonControl from '@/components/control/ButtonControl.vue'
import QInputComponent from '@/components/input/QInput.vue'
import { containers, spacing, palette } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { ApiUser, ChannelMessage, ChannelRole } from '@/utils/types/channel'
import { ValidationRule } from '@/utils/types/misc'

const router = useRouter()
const { login } = useAuthStore()

// Reactive state for input
const form = reactive({
  email: '',
  password: '',
})

const isFormValid = computed(() => form.email !== '' && form.password !== '')

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

const handleLogin = async () => {
  const res = await api.post('/auth/login', {
    email: form.email,
    password: form.password,
  })

  const { token, user } = res.data

  api.defaults.headers.common.Authorization = token.headers.authorization

  login(user, token.headers.authorization)

  const channelsRes = await api.get('/channel/me')

  const channels = channelsRes.data

  const _channelsObj = channels.map(
    (channel: {
      id: number
      name: string
      privacy: string
      ownerId: number
      users: ApiUser[]
      messages: ChannelMessage[]
    }) => ({
      id: channel.id,
      name: channel.name,
      privacy: channel.privacy,
      slug: '',
      members: channel.users.map((user: ApiUser) => ({
        userId: user.id,
        role:
          user.id === channel.ownerId ? ChannelRole.ADMIN : ChannelRole.MEMBER,
        joinedAt: '',
        kickCount: 0,
      })),
      messages: channel.messages,
    }),
  )

  const { setChannels, setActiveChannel } = useChannelStore()
  setChannels(_channelsObj)
  setActiveChannel(_channelsObj[0])

  // _channelsObj.forEach(async (channel: ChannelData) => {
  //   const transmit = new Transmit({
  //     baseUrl: 'http://localhost:3333',
  //   })
  //   const sub = transmit.subscription(`channel:${channel.id}`)
  //   await sub.create()
  //   sub.onMessage((message) => {
  //     console.log(message)
  //   })
  // })

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
