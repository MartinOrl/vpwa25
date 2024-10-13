<template>
  <div>
    <img />
    <div>
      <p>
        {{ $props.channel.name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { ChannelInfo } from '@/utils/types/channel'

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
})
</script>
