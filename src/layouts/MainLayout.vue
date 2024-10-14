<template>
  <div
    :style="{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: palette.primary,
    }"
  >
    <header
      :style="{
        background: palette.primary,
        color: palette.textOnPrimary,
        padding: '0.5rem 0.75rem 0.5rem 0',
        display: 'flex',
        alignItems: 'center',
      }"
    >
      <div
        :style="{
          'max-width': containers.utils,
          width: '100%',
          display: 'block',
        }"
      ></div>
      <div
        :style="{
          maxWidth: containers.sidebar,
          width: '100%',
          display: 'flex',
          justifyContent: 'end',
        }"
      >
        <ChannelsHistory />
      </div>
      <div
        :style="{
          marginLeft: 'auto',
        }"
      >
        <q-icon name="help" color="white" size="1.25rem" />
      </div>
    </header>

    <div
      :style="{
        display: 'flex',
        flexDirection: 'row',
        flex: '1',
      }"
    >
      <div :style="utilsStyles">
        <div
          :style="{
            marginTop: 'auto',
          }"
        >
          <ProfileIcon />
        </div>
      </div>

      <div :style="mainContentStyles">
        <q-list :style="drawerStyles">
          <ChannelCard
            v-for="channel in channelsTest"
            :key="channel.slug"
            :channel="channel"
          />
        </q-list>
        <div
          :style="{
            flex: '1',
          }"
        >
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
import ChannelsHistory from '@/components/channel/channelsHistory.vue'
import ProfileIcon from '@/components/control/ProfileIcon.vue'
import { containers, palette, spacing } from '@/css/theme'
import { ChannelInfo, ChannelPrivacy } from '@/utils/types/channel'

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

const channelsTest: ChannelInfo[] = [
  {
    name: 'General',
    admin: 'admin',
    slug: 'general',
    privacy: ChannelPrivacy.PUBLIC,
  },
  {
    name: 'Private',
    admin: 'admin',
    slug: 'private',
    privacy: ChannelPrivacy.PRIVATE,
  },
  {
    name: 'Secret',
    admin: 'admin',
    slug: 'secret',
    privacy: ChannelPrivacy.PUBLIC,
  },
]

const mainContentStyles = computed<CSSProperties>(() => ({
  flex: '1',
  display: 'flex',
  flexDirection: 'row',
  background: palette.background,
  margin: `
    0
    ${spacing(3)}
    ${spacing(3)}
    0
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
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: spacing(8),
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
