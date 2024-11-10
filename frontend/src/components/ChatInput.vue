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
import ButtonControl from '@/components/control/ButtonControl.vue'
import { palette, spacing } from '@/css/theme'
import { useCommandStore } from '@/stores/commandStore'
import { Events } from '@/utils/types/command'
import CommandPrompt from './command/commandPrompt.vue'

const { callEvent } = useCommandStore()

const sendMessage = async () => {
  callEvent({
    type: Events.RequestSendMessage,
  })
}
</script>
