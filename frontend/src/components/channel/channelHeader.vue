<template>
  <div :style="channelHeaderContainerStyles">
    <div
      :style="{
        display: 'flex',
        flexDirection: 'row',
        gap: spacing(2),
        alignItems: 'center',
      }"
    >
      <q-icon
        :name="
          activeChannel.privacy === ChannelPrivacy.PRIVATE ? 'lock' : 'public'
        "
        :style="channelIconStyles"
      />
      <p
        :style="{
          color: palette.textOnPrimary,
          fontSize: '1.2rem',
        }"
      >
        {{ activeChannel.name }}
      </p>
      <ChannelMembers />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import ChannelMembers from '@/components/channel/channelMembers.vue'
import { palette, spacing } from '@/css/theme'
import { useChannelStore } from '@/stores/channelStore'
import { ChannelInfo, ChannelPrivacy } from '@/utils/types/channel'

const { getActiveChannel } = useChannelStore()

const activeChannel = computed(() => getActiveChannel() as ChannelInfo)

const channelHeaderContainerStyles = computed<CSSProperties>(() => ({
  display: 'flex',
  gap: '10px',
  flexDirection: 'column',
  padding: `${spacing(3)} ${spacing(4)}`,
  width: '100%',
  borderBottom: '1px solid',
  borderColor: palette.border,
}))
const channelIconStyles = computed<CSSProperties>(() => ({
  color: palette.textOnPrimary,
  transition: 'all 0.2s ease-in-out',
  fontSize: '1rem',
}))
</script>
