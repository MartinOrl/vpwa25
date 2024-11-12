<template>
  <q-btn flat no-caps unelevated dense :style="channelCardStyles">
    <div :style="channelContainerStyles" @click="selectChannel">
      <q-icon
        :name="
          $props.channel.privacy === ChannelPrivacy.PRIVATE ? 'lock' : 'public'
        "
        :style="channelIconStyles"
      />

      <p :style="channelInfoStyles">
        {{ $props.channel.name }}
      </p>
      <q-icon
        v-if="isUserInvited"
        name="email"
        :style="{
          color: palette.textOnPrimary,
          fontSize: '1rem',
          marginRight: spacing(0.5),
        }"
      />
      <div v-if="hasNotifications" :style="channelNotifyWrapperStyles">
        <p :style="channelNotifyCountStyles">
          {{ notificationsCount > 9 ? '9+' : notificationsCount }}
        </p>
      </div>
      <div @click.stop="channelOptionsMenu = !channelOptionsMenu">
        <q-icon
          name="more_vert"
          :style="{
            color: palette.textOpaque,
            fontSize: '1.25rem',
          }"
        />
      </div>
    </div>
    <q-menu
      v-model="channelOptionsMenu"
      anchor="top right"
      self="top left"
      :offset="[-8, 0]"
      :style="{
        background: palette.background,
        border: `1px solid ${palette.border}`,
        borderRadius: spacing(2),
        color: palette.textOpaque,
      }"
    >
      <q-list
        :style="{
          width: '100%',
        }"
      >
        <q-item
          clickable
          v-close-popup
          v-for="channel in channelOptions"
          :key="channel.id"
          :style="{
            padding: '0',
          }"
        >
          <q-item-section :style="channelOptionStyles">
            <q-icon :name="channel.icon" />
            <p>{{ channel.label }}</p>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref } from 'vue'
import type { CSSProperties } from 'vue'
import { spacing, palette } from '@/css/theme'
import { useChannelStore } from '@/stores/channelStore'
import { ChannelData, ChannelInfo, ChannelPrivacy } from '@/utils/types/channel'

const channelStore = useChannelStore()
const { getActiveChannel, setActiveChannel } = channelStore

const channelOptionsMenu = ref(false)
const hasNotifications = ref(false)
const isUserInvited = ref(false)
const notificationsCount = ref(0)

const channelOptions = [
  {
    id: 'leave_channel',
    label: 'Leave Channel',
    icon: 'exit_to_app',
    action: () => {
      console.log('Leave Channel')
    },
  },
  {
    id: 'close_channel',
    label: 'Close Channel',
    icon: 'close',
    action: () => {
      console.log('Close Channel')
    },
  },
]

const props = defineProps<{
  channel: ChannelData
}>()

const isNotification = false

const isChannelActive = computed(() => {
  const activeChannel = getActiveChannel()
  return activeChannel?.slug === props.channel.slug
})

const selectChannel = () => {
  setActiveChannel(props.channel)
}

channelStore.$subscribe(() => {
  const channelMetadata = channelStore.getChannelMetadata(
    props.channel?.id as number,
  )
  hasNotifications.value =
    Boolean(channelMetadata?.notifications.length) || false
  notificationsCount.value = channelMetadata?.notifications.length || 0
  isUserInvited.value = channelMetadata?.isInvitation || false
})

const channelCardStyles = computed<CSSProperties>(() => ({
  padding: `${spacing(2)} ${spacing(5)}`,
  display: 'flex',
  flexDirection: 'row',
  gap: spacing(3),
  alignItems: 'center',
  cursor: 'pointer',
  width: '100%',
  background: isNotification ? palette.backgroundWhiteOpaque : 'transparent',
}))

const channelNotifyCountStyles = computed<CSSProperties>(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '0.625rem',
}))

const channelNotifyWrapperStyles = computed<CSSProperties>(() => ({
  background: palette.backgroundWhiteOpaque,
  color: palette.textOnPrimary,
  borderRadius: '50%',
  padding: '0.25rem',
  width: '1.5rem',
  height: '1.5rem',
  position: 'relative',
}))

const channelOptionStyles = computed<CSSProperties>(() => ({
  padding: `${spacing(1)} ${spacing(3)}`,
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  gap: spacing(2),
  alignItems: 'center',
  fontSize: '0.75rem',
}))

const channelIconStyles = computed<CSSProperties>(() => ({
  color: isChannelActive.value ? palette.textOnPrimary : palette.textOpaque,
  transition: 'all 0.2s ease-in-out',
  fontSize: '1rem',
}))

const channelContainerStyles = computed<CSSProperties>(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: spacing(1),
  alignItems: 'center',
  width: '100%',
}))

const channelInfoStyles = computed<CSSProperties>(() => ({
  color: isChannelActive.value ? palette.textOnPrimary : palette.textOpaque,
  transition: 'all 0.2s ease-in-out',
  marginRight: 'auto',
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
