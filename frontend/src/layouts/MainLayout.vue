<template>
  <div
    :style="{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: palette.primary,
    }"
  >
    <div
      :style="{
        display: 'flex',
        flexDirection: 'row',
        flex: '1',
      }"
      class="break-md-col"
    >
      <div :style="utilsStyles" class="break-md-mb-0">
        <ProfileIcon />
      </div>

      <div :style="mainContentStyles">
        <q-list :style="drawerStyles" class="channelList">
          <ChannelCard
            v-for="channel in channels"
            :key="channel.slug"
            :channel="channel"
          />
        </q-list>
        <div
          :style="{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '100%',
          }"
        >
          <ChannelHeader />
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import type { CSSProperties } from 'vue'
import ChannelCard from '@/components/channel/channelCard.vue'
import ChannelHeader from '@/components/channel/channelHeader.vue'
import ProfileIcon from '@/components/control/ProfileIcon.vue'
import { containers, palette, spacing } from '@/css/theme'
import { useChannelStore } from '@/stores/channelStore'

defineOptions({
  name: 'MainLayout',
})

defineComponent({
  setup() {
    return {
      palette,
    }
  },
})

const { getChannels } = useChannelStore()

const channels = computed(() => getChannels())

const mainContentStyles = computed<CSSProperties>(() => ({
  flex: '1',
  display: 'flex',
  flexDirection: 'row',
  background: palette.background,
  margin: `
    ${spacing(3)}
  `,
  borderRadius: `
    ${spacing(3)}
  `,
  border: `1px solid ${palette.border}`,
}))

const utilsStyles = computed<CSSProperties>(() => ({
  maxWidth: containers.utils,
  width: '100%',
  border: 'none',
  background: palette.primary,
  display: 'flex',
  flexDirection: 'column',
  marginBottom: spacing(8),
  marginRight: `-${spacing(3)}`,
  marginTop: spacing(3),
}))

const drawerStyles = computed<CSSProperties>(() => ({
  maxWidth: containers.sidebar,
  width: '100%',
  border: 'none',
  flex: '1',
  height: '100%',
  borderRight: `1px solid ${palette.border}`,
}))
</script>
