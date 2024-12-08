<template>
  <div class="input-container break-md-col" :style="chatInputStyles">
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
      :disabled="isOffline"
      class="break-md-w-full"
    />
    <div
      :style="isTypingStyles"
      @mouseenter="showTyping = true"
      @mouseleave="showTyping = false"
    >
      <div
        :style="{
          background: palette.secondary,
          border: `1px solid ${palette.border}`,
          borderRadius: `${spacing(1)}`,
          width: '100%',
        }"
      >
        <div
          :style="{
            color: palette.textOnPrimary,
            padding: `${spacing(1)} ${spacing(2)}`,
            width: '100%',

            display: 'flex',
            alignItems: 'center',
            gap: spacing(3),
          }"
        >
          <q-icon name="typing" />
          <p>{{ userTyping.name }} is typing</p>
        </div>
        <div>
          <p
            :style="{
              color: palette.textOnPrimary,
              padding: showTyping ? `${spacing(1)} ${spacing(2)}` : 0,
              width: '100%',
              maxHeight: showTyping ? '250px' : '0',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              opacity: showTyping ? 1 : 0,
            }"
          >
            {{ userTyping.message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Subscription } from '@adonisjs/transmit-client'
import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { backendTransmit } from '@/boot/transmit'
import ButtonControl from '@/components/control/ButtonControl.vue'
import { palette, spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { useCommandStore } from '@/stores/commandStore'
import { Events } from '@/utils/types/command'
import { UserStatus } from '@/utils/types/user'
import CommandPrompt from './command/commandPrompt.vue'
const { user } = useAuthStore()
const commandStore = useCommandStore()
const { callEvent } = commandStore
const channelStore = useChannelStore()
const { getActiveChannel } = channelStore

const isUserTyping = ref(false)
const userTyping = ref({
  name: '',
  message: '',
})
const showTyping = ref(false)
const isOffline = computed(() => user?.status === UserStatus.OFFLINE)
const activeChannel = ref(getActiveChannel())

channelStore.$subscribe(() => {
  activeChannel.value = getActiveChannel()
})

// watch for typing event, if 5 seconds pass without a typing event, set isUserTyping to false
let typingTimeout: NodeJS.Timeout
watch(isUserTyping, (value) => {
  if (value) {
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      callEvent({
        type: Events.TypingStop,
      })
    }, 5000)
  }
})

let isTypingSub: Subscription | null = null

if (activeChannel.value) {
  isTypingSub = backendTransmit.subscription(
    `channel/${activeChannel.value?.id}/typing`,
  )

  isTypingSub.create()
  isTypingSub.onMessage((data: string) => {
    const { message, name } = JSON.parse(data)
    if (!message) {
      isUserTyping.value = false
    } else {
      isUserTyping.value = true
      userTyping.value = {
        name,
        message,
      }
    }
  })
}

watch(activeChannel, () => {
  if (isTypingSub?.isCreated) {
    isTypingSub.delete()
  }

  isTypingSub = backendTransmit.subscription(
    `channel/${activeChannel.value?.id}/typing`,
  )

  isTypingSub.create()
  isTypingSub.onMessage((data: string) => {
    const { message, name } = JSON.parse(data)
    if (!message) {
      isUserTyping.value = false
    } else {
      isUserTyping.value = true
      userTyping.value = {
        name,
        message,
      }
    }
  })
})

const chatInputStyles = computed<CSSProperties>(() => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 'auto',
  padding: `${spacing(2)} ${spacing(3)}`,
  gap: spacing(3),
  position: 'relative',
}))

const isTypingStyles = computed<CSSProperties>(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: spacing(2),
  position: 'absolute',
  left: 0,
  bottom: window.innerWidth < 768 ? '110px' : `${spacing(12.25)}`,
  width: '100%',
  padding: `${spacing(2)} ${spacing(3)}`,
  opacity: isUserTyping.value ? 1 : 0,
  transition: 'opacity 0.3s',
  zIndex: 1,
}))

const sendMessage = async () => {
  callEvent({
    type: Events.RequestSendMessage,
  })
}
</script>
