<template>
  <div
    :style="{
      padding: `${spacing(3)} ${spacing(6)}`,
      display: 'flex',
      flexDirection: 'row',
      gap: spacing(3),
      alignItems: 'center',
      cursor: 'pointer',
    }"
  >
    <q-icon
      name="lock"
      v-show="$props.channel.privacy !== ChannelPrivacy.PUBLIC"
      :style="{
        color: palette.textOpaque,
      }"
    />
    <q-icon
      name="tag"
      v-show="$props.channel.privacy !== ChannelPrivacy.PRIVATE"
      :style="{
        color: palette.textOpaque,
      }"
    />
    <div>
      <p
        :style="{
          color: palette.textOpaque,
          margin: 0,
        }"
      >
        {{ $props.channel.name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { spacing, palette } from '@/css/theme'
import { ChannelInfo, ChannelPrivacy } from '@/utils/types/channel'

defineProps<{
  channel: ChannelInfo
}>()

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
