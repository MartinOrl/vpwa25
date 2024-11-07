<template>
  <div
    class="input-container break-md-col"
    :style="{
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto',
      padding: `${spacing(2)} ${spacing(3)}`,
      gap: spacing(3),
    }"
  >
    <CommandPrompt />
    <ButtonControl
      label="Send Message"
      variant="primary"
      @click="sendMessage"
      :style="{
        backgroundColor: palette.primary,
        color: palette.textOnPrimary,
        padding: `${spacing(3)} ${spacing(8)}`,
        width: 'auto',
      }"
      class="break-md-w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import ButtonControl from '@/components/control/ButtonControl.vue'
// import QInputComponent from '@/components/input/QInput.vue'
import { palette, spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import CommandPrompt from './command/commandPrompt.vue'

const { user } = useAuthStore()

const message = ref('')

type Message = {
  text: string
  sender: string
  image: string
  timestamp: string
}

const messages = ref<Message[]>([
  {
    text: 'Hello, how can I help you today?',
    sender: 'Miguel',

    image: 'https://randomuser.me/api/portraits/lego/6.jpg',
    timestamp: '10:00 AM',
  },
])

const sendMessage = async () => {
  if (message.value.trim() !== '') {
    messages.value.push({
      text: message.value,
      sender: user?.name + ' ' + user?.surname,
      image: user?.image ?? '',
      timestamp: new Date().toLocaleTimeString('en-us', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    })
    message.value = ''
  }
  await nextTick()
  const chatContainer = document.querySelector('#chat-overflow')
  chatContainer?.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: 'smooth',
  })
}
</script>
