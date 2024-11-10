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
          padding: '10px 0',
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
        >
          <MessageDateSeparator
            v-if="getShowDateSeparator(index)"
            :date="new Date(msg.timestamp)"
          />
          <div :style="getMessageStyle()">
            <ChannelMessage :message="msg" />
          </div>
        </div>
        <div v-if="!messages.length" :style="noMessagesStyle">
          <p>No messages yet. Start the conversation!</p>
        </div>
      </div>
    </div>
  </div>
  <ChatInput />
</template>

<script setup lang="ts">
import { computed, nextTick, onUpdated } from 'vue'
import ChannelMessage from '@/components/channel/channelMessage.vue'
import MessageDateSeparator from '@/components/channel/messageDateSeparator.vue'
import ChatInput from '@/components/ChatInput.vue'
import { palette, spacing } from '@/css/theme'
import { useChannelStore } from '@/stores/channelStore'
const channelStore = useChannelStore()

const messages = computed(() => {
  return channelStore.getChannelMessages()
})

onUpdated(async () => {
  await nextTick()
  const chatContainer = document.querySelector('#chat-overflow')
  chatContainer?.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: 'smooth',
  })
})

const getShowDateSeparator = (index: number) => {
  if (index === 0) return true
  const currentDate = new Date(messages.value[index].timestamp)
  const previousDate = new Date(messages.value[index - 1].timestamp)
  return currentDate.getDate() !== previousDate.getDate()
}

const getMessageStyle = () => {
  return {
    color: palette.textOnPrimary,
    padding: '10px 20px',
    display: 'flex',
    gap: spacing(2),
    borderRadius: '20px',
    width: '100%',
    alignSelf: 'flex-start',
  }
}

const noMessagesStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  color: palette.textOpaque,
}
</script>
