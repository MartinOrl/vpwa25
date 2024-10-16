<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      padding: '10px',
      boxSizing: 'border-box',
    }"
  >
    <div
      class="chat-container"
      :style="{
        backgroundColor: palette.background,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        boxSizing: 'border-box',
        flex: 1,
        height: '100%',
        justifyContent: 'flex-end',
      }"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message-bubble"
        :style="getMessageStyle(msg)"
      >
        <img
          :src="msg.image"
          :style="{
            width: '2.75rem',
            height: '2.75rem',
            cursor: 'pointer',
            display: 'block',
            borderRadius: spacing(2),
          }"
        />
        <div>
          <p>
            {{ msg.sender }}
            <span
              :style="{
                fontSize: '0.75rem',
                color: palette.textOpaque,
                marginLeft: 'auto',
              }"
              >{{ msg.timestamp }}</span
            >
          </p>
          {{ msg.text }}
        </div>
      </div>
    </div>
    <div
      class="input-container"
      :style="{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
      }"
    >
      <QInputComponent
        v-model="message"
        label="Type your message here..."
        type="text"
        errorMessage=""
        :style="{
          flexGrow: 1,
          borderColor: palette.primary,
          color: palette.textOpaque,
        }"
        outlined
        clearable
        dense
      />
      <ButtonControl
        label="Send"
        variant="primary"
        @click="sendMessage"
        :style="{
          backgroundColor: palette.primary,
          color: palette.textOnPrimary,
          marginLeft: '10px',
          padding: '12px 15px',
          width: 'auto',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ButtonControl from '@/components/control/ButtonControl.vue'
import QInputComponent from '@/components/input/QInput.vue'
import { containers, palette, spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
console.log(containers.sidebar)
const message = ref('')
const { user } = useAuthStore()

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

const sendMessage = () => {
  if (message.value.trim() !== '') {
    messages.value.push({
      text: message.value,
      sender: user?.name + ' ' + user?.surname,
      image: user?.image ?? '',
      timestamp: new Date().toLocaleTimeString(),
    })
    message.value = ''
  }
}

const getMessageStyle = (msg: Message) => {
  const isSentByUser = msg.sender === user?.name + ' ' + user?.surname
  return {
    backgroundColor: isSentByUser ? palette.accent : palette.primary,
    color: palette.textOnPrimary,
    padding: '10px 15px',
    display: 'flex',
    gap: spacing(3),
    borderRadius: '20px',
    margin: '5px 0',
    maxWidth: '80%',
    alignSelf: isSentByUser ? 'flex-end' : 'flex-start',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  }
}
</script>
