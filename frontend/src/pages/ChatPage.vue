<template>
  <div
    :style="{
      position: 'relative',
      height: '100%',
      flexGrow: 1,
    }"
  >
    <div
      v-if="isOffline"
      :style="{
        position: 'absolute',
        top: '0',
        zIndex: 100,
        width: '100%',
        padding: spacing(2),
        background: palette.warning,
        color: palette.textOnPrimary,
        borderBottom: `1px solid ${palette.border}`,
        textAlign: 'center',
      }"
    >
      <p>
        You are currently offline. In order to chat, please update your status
      </p>
    </div>
    <div
      :style="{
        position: 'absolute',
        height: '100%',
        bottom: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
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
        <div v-if="loading">
          <div class="row justify-center q-my-md">
            <q-spinner color="#000" name="dots" size="40px" />
          </div>
        </div>
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
import { useQuasar } from 'quasar'
import {
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
} from 'vue'
import ChannelMessage from '@/components/channel/channelMessage.vue'
import MessageDateSeparator from '@/components/channel/messageDateSeparator.vue'
import ChatInput from '@/components/ChatInput.vue'
import { palette, spacing } from '@/css/theme'
import { sanitizeStatus, useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { UserStatus } from '@/utils/types/user'
const channelStore = useChannelStore()
const { user } = useAuthStore()

const isOffline = ref(user?.status === UserStatus.OFFLINE)

const authStore = useAuthStore()

authStore.$subscribe(() => {
  isOffline.value =
    sanitizeStatus(authStore.user?.status as UserStatus) ===
    sanitizeStatus(UserStatus.OFFLINE)
})

const isNoChannelSelected = ref(
  (channelStore.getUserChannels(user?.id as number) ?? []).length === 0,
)
const loading = ref(false)
const loaded = ref(false)

const _loadMessages = async () => {
  loading.value = true
  console.log('loading messages')
  // await channelStore.loadMessages()
  await new Promise((resolve) => setTimeout(resolve, 8000))
  loading.value = false
}

const activeChannelId = ref(channelStore.getActiveChannel()?.id as number)

const activeChannel = computed(() => {
  const activeChannel = channelStore.getActiveChannel()
  return activeChannel
})

const $q = useQuasar()

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  // console.log(target.scrollTop)
  if (
    target.scrollTop <= 300 &&
    messages.value.length > 20 &&
    !loading.value &&
    loaded.value
  ) {
    _loadMessages()
  }
}

onMounted(() => {
  const chatContainer = document.querySelector('#chat-overflow') as HTMLElement
  const child = chatContainer?.firstElementChild as HTMLElement

  if (child.clientHeight < chatContainer.clientHeight) {
    console.log('load more messages')
  }

  chatContainer?.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  const chatContainer = document.querySelector('#chat-overflow')
  chatContainer?.removeEventListener('scroll', handleScroll)
})

watch(
  () => $q.appVisible,
  async (isVisible) => {
    if (isVisible) {
      await channelStore.load()
    }
  },
)

watch(isOffline, () => {
  if (!isOffline.value) {
  }
})

onBeforeMount(async () => {
  await channelStore.load()
})

watch(activeChannel, async () => {
  if (activeChannel.value) {
    await channelStore.load()
  }
})

channelStore.$subscribe(() => {
  const userChannels = channelStore.getChannels() || []

  if (userChannels?.length > 0) {
    isNoChannelSelected.value = false
  } else {
    isNoChannelSelected.value = true
  }

  activeChannelId.value = channelStore.getActiveChannel()?.id as number
})

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
  await nextTick()
  loaded.value = true
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
