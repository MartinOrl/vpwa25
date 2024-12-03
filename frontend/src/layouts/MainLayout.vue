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

      <div :style="mainContentStyles" class="break-md-col">
        <q-list :style="drawerStyles" class="channelList">
          <ChannelCard
            v-for="channel in channels"
            :key="channel.slug"
            :channel="channel"
          />
        </q-list>

        <div
          class="hidden-md"
          :style="{
            width: '100%',
            padding: '0',
            position: 'relative',
          }"
        >
          <div
            :style="{
              width: '100%',
              borderBottom: `1px solid ${palette.border}`,
            }"
          >
            <div
              :style="{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: spacing(6),
                cursor: 'pointer',
              }"
            >
              <p
                :style="{
                  color: palette.textOnPrimary,
                  padding: spacing(3),
                  fontWeight: 'bold',
                }"
              >
                Select Channel
              </p>
              <q-icon
                :name="channelMenu ? 'arrow_drop_up' : 'arrow_drop_down'"
                :style="{
                  color: palette.textOpaque,
                }"
                @click="toggleChannelMenu"
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
              width: '100%',
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
                :key="channel.id"
                :style="{
                  padding: '0',
                }"
              >
                <q-item-section>
                  <ChannelCard :channel="channel" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>

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
import { computed, defineComponent, ref } from 'vue'
import type { CSSProperties } from 'vue'
import ChannelCard from '@/components/channel/channelCard.vue'
import ChannelHeader from '@/components/channel/channelHeader.vue'
import ProfileIcon from '@/components/control/ProfileIcon.vue'
import { containers, palette, spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'

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

const channelStore = useChannelStore()
const { getUserChannels } = channelStore
const { user } = useAuthStore()

const channels = ref(getUserChannels(user?.id as number))

channelStore.$subscribe(() => {
  channels.value = getUserChannels(user?.id as number)
})

function toggleChannelMenu() {
  console.log('toggleChannelMenu')
  channelMenu.value = !channelMenu.value
}

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
  display: 'flex',
  flexDirection: 'column',
}))
</script>
