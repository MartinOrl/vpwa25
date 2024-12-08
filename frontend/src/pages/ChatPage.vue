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
        v-if="isNoChannelSelected"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          color: palette.textOpaque,
        }"
      >
        <p>No channel selected. Please select a channel to start chatting.</p>
      </div>
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
        v-if="!isNoChannelSelected"
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
import { Notify } from 'quasar'
import { computed, nextTick, onUpdated, ref, watch } from 'vue'
import ChannelMessage from '@/components/channel/channelMessage.vue'
import MessageDateSeparator from '@/components/channel/messageDateSeparator.vue'
import ChatInput from '@/components/ChatInput.vue'
import { palette, spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
const channelStore = useChannelStore()
const { user } = useAuthStore()

const isNoChannelSelected = ref(
  (channelStore.getUserChannels(user?.id as number) ?? []).length === 0,
)

channelStore.$subscribe(() => {
  const userChannels = channelStore.getUserChannels(user?.id as number) ?? []

  if (userChannels?.length > 0) {
    isNoChannelSelected.value = false
  } else {
    isNoChannelSelected.value = true
  }
  console.log('isNoChannelSelected', isNoChannelSelected.value)
})

const messages = computed(() => {
  return channelStore.getChannelMessages()
})

watch(messages, (newMessages, oldMessages) => {
  if (newMessages.length > oldMessages.length) {
    const newMessage = newMessages[newMessages.length - 1]
    if (newMessage.senderID !== user?.id) {
      const senderName = channelStore.getUserNameById(newMessage.senderID)
      Notify.create({
        message: newMessage.content,
        caption: `Od: ${senderName}`,
        color: palette.primary,
        textColor: palette.textOnPrimary,
        position: 'top-right',
        timeout: 5000,
        actions: [
          {
            label: 'Open',
            handler: () => {
              console.log('MIKE OCKSMALL')
            },
          },
        ],
      })
    }
  }
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
