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
        class="hidden-md"
      >
        <div>
          <div
            :style="{
              marginTop: 'auto',
            }"
          >
            <ProfileIcon />
          </div>
        </div>
      </div>
      <div
        :style="{
          maxWidth: containers.sidebar,
          width: '100%',
          display: 'flex',
          justifyContent: 'end',
        }"
        class="break-md-w-unset"
      >
        <ChannelsHistory />
      </div>
      <CommandPrompt />
    </header>

    <div
      :style="{
        display: 'flex',
        flexDirection: 'row',
        flex: '1',
      }"
    >
      <div :style="utilsStyles" class="break-md-hide">
        <div
          :style="{
            marginTop: 'auto',
          }"
        >
          <ProfileIcon />
        </div>
      </div>

      <div :style="mainContentStyles" class="break-md-col">
        <q-list :style="drawerStyles" class="channelList">
          <ChannelCard
            v-for="channel in channels"
            :key="channel.slug"
            :channel="channel"
          />
        </q-list>

        <q-btn
          flat
          dense
          class="hidden-md"
          :style="{
            width: '100%',
            padding: '0',
          }"
        >
          <div
            :style="{
              width: '100%',
              borderBottom: `1px solid ${palette.border}`,
            }"
            @click="toggleChannelMenu"
          >
            <div
              :style="{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: spacing(6),
              }"
            >
              <ChannelCard :channel="activeChannel" />
              <q-icon
                name="arrow_drop_down"
                :style="{
                  color: palette.textOpaque,
                }"
              />
            </div>
          </div>

          <q-menu
            v-model="channelMenu"
            anchor="bottom left"
            self="top left"
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
                v-for="channel in channels"
                :key="channel.name"
              >
                <q-item-section>
                  <ChannelCard :channel="channel" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <div
          :style="{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '100%',
            height: '100%',
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
import { computed, defineComponent, ref } from 'vue'
import type { CSSProperties } from 'vue'
import ChannelCard from '@/components/channel/channelCard.vue'
import ChannelHeader from '@/components/channel/channelHeader.vue'
import ChannelsHistory from '@/components/channel/channelsHistory.vue'
import CommandPrompt from '@/components/command/commandPrompt.vue'
import ProfileIcon from '@/components/control/ProfileIcon.vue'
import { containers, palette, spacing } from '@/css/theme'
import { useChannelStore } from '@/stores/channelStore'
import { ChannelInfo } from '@/utils/types/channel'

const channelMenu = ref(false)

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

const { getChannels, getActiveChannel } = useChannelStore()

const channels = computed(() => getChannels())

const activeChannel = computed(() => getActiveChannel() as ChannelInfo)

function toggleChannelMenu() {
  channelMenu.value = true
}

const mainContentStyles = computed<CSSProperties>(() => ({
  flex: '1',
  display: 'flex',
  flexDirection: 'row',
  background: palette.background,
  margin: `
    0
    ${spacing(3)}
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
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: spacing(8),
  marginRight: `-${spacing(3)}`,
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
