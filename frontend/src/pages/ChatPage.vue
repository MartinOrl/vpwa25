<template>
  <div
    :style="{
      position: 'relative',
      height: '100%',
    }"
  >
    <div
      :style="{
        position: 'absolute',
        height: '100%',
        bottom: 0,
        left: 0,
        width: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }"
      id="chat-overflow"
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
          justifyContent: 'flex-end',
          marginTop: 'auto',
        }"
      >
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-bubble"
          :style="getMessageStyle()"
        >
          <img
            :src="msg.image"
            :style="{
              width: '2.25rem',
              height: '2.25rem',
              cursor: 'pointer',
              display: 'block',
              borderRadius: spacing(2),
            }"
          />
          <div
            :style="{
              width: '100%',
            }"
          >
            <div
              :style="{
                display: 'flex',
                alignItems: 'flex-end',
              }"
            >
              <p
                :style="{
                  fontWeight: 'bold',
                }"
              >
                {{ msg.sender }}
              </p>
              <span
                :style="{
                  fontSize: '0.75rem',
                  color: palette.textOpaque,
                  marginLeft: spacing(1),
                }"
                >{{ msg.timestamp }}</span
              >
            </div>

            <p
              :style="{
                marginTop: spacing(0.5),
              }"
            >
              {{ msg.text }}
            </p>
          </div>
        </div>
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
      padding: `${spacing(2)} ${spacing(3)}`,
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
      label="Send Message"
      variant="primary"
      @click="sendMessage"
      :style="{
        backgroundColor: palette.primary,
        color: palette.textOnPrimary,
        marginLeft: '10px',
        padding: `${spacing(3)} ${spacing(8)}`,
        width: 'auto',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import ButtonControl from '@/components/control/ButtonControl.vue'
import QInputComponent from '@/components/input/QInput.vue'
import { palette, spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { ChannelInfo } from '@/utils/types/channel'
const message = ref('')
const { user } = useAuthStore()
const channelStore = useChannelStore()

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

onMounted(() => {
  const chatContainer = document.querySelector('#chat-overflow')
  chatContainer?.scrollTo({
    top: chatContainer.scrollHeight,
  })
})

// if active channel changes, reset messages. Check it by using subscribe method from pinia
watch(
  () => channelStore.getActiveChannel() as ChannelInfo | null,
  (_newChannel: ChannelInfo | null) => {
    messages.value = [
      {
        text: 'Hello, how can I help you today?',
        sender: 'Miguel',

        image: 'https://randomuser.me/api/portraits/lego/6.jpg',
        timestamp: '10:00 AM',
      },
    ]
  },
)

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

const getMessageStyle = () => {
  return {
    color: palette.textOnPrimary,
    padding: '10px 15px',
    display: 'flex',
    gap: spacing(2),
    borderRadius: '20px',
    margin: '5px 0',
    width: '100%',
    alignSelf: 'flex-start',
  }
}
</script>
