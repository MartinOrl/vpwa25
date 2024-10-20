<template>
  <q-btn flat no-caps dense :style="channelCardStyles" @click="selectChannel">
    <div :style="channelContainerStyles">
      <q-icon
        :name="
          $props.channel.privacy === ChannelPrivacy.PRIVATE ? 'lock' : 'public'
        "
        :style="channelIconStyles"
      />

      <p :style="channelInfoStyles">
        {{ $props.channel.name }}
      </p>
    </div>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import type { CSSProperties } from 'vue'
import { spacing, palette } from '@/css/theme'
import { useChannelStore } from '@/stores/channelStore'
import { ChannelInfo, ChannelPrivacy } from '@/utils/types/channel'

const { getActiveChannel, setActiveChannel } = useChannelStore()

const props = defineProps<{
  channel: ChannelInfo
}>()

const isChannelActive = computed(() => {
  const activeChannel = getActiveChannel()
  return activeChannel?.slug === props.channel.slug
})

const selectChannel = () => {
  setActiveChannel(props.channel)
}

const channelCardStyles = computed<CSSProperties>(() => ({
  padding: `${spacing(2)} ${spacing(5)}`,
  display: 'flex',
  flexDirection: 'row',
  gap: spacing(3),
  alignItems: 'center',
  cursor: 'pointer',
  width: '100%',
}))

const channelIconStyles = computed<CSSProperties>(() => ({
  color: isChannelActive.value ? palette.textOnPrimary : palette.textOpaque,
  transition: 'all 0.2s ease-in-out',
  fontSize: '1rem',
}))

const channelContainerStyles = computed<CSSProperties>(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: spacing(3),
  alignItems: 'center',
  width: '100%',
}))

const channelInfoStyles = computed<CSSProperties>(() => ({
  color: isChannelActive.value ? palette.textOnPrimary : palette.textOpaque,
  transition: 'all 0.2s ease-in-out',
}))

defineComponent({
  props: {
    channel: {
      type: Object as () => ChannelInfo,
      required: true,
    },
  },
  setup() {
    return {
      spacing,
      palette,
    }
  },
})
</script>
