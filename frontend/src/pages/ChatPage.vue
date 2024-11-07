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
  <ChatInput />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ChatInput from '@/components/ChatInput.vue'
import { palette, spacing } from '@/css/theme'
import { useChannelStore } from '@/stores/channelStore'
import { ChannelInfo } from '@/utils/types/channel'
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

const getMessageStyle = () => {
  return {
    color: palette.textOnPrimary,
    padding: '10px 15px',
    display: 'flex',
    gap: spacing(2),
    borderRadius: '20px',
    width: '100%',
    alignSelf: 'flex-start',
  }
}
</script>
