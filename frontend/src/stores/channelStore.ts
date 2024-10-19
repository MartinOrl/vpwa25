import { defineStore } from 'pinia'
import type { ChannelInfo } from '@/utils/types/channel'

export const useChannelStore = defineStore('channel', {
  state: () => ({
    channels: [] as ChannelInfo[] | null,
    activeChannel: null as ChannelInfo | null,
  }),

  actions: {
    setChannels(channels: ChannelInfo[] | null) {
      this.channels = channels
    },
    setActiveChannel(channel: ChannelInfo | null) {
      this.activeChannel = channel
    },
    getActiveChannel() {
      return this.activeChannel
    },
    getChannels() {
      return this.channels
    },
  },
})
