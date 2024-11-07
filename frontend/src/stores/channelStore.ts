import { defineStore } from 'pinia'
import type { ChannelInfo } from '@/utils/types/channel'

export const useChannelStore = defineStore('channel', {
  state: () => ({
    channels: [] as ChannelInfo[] | null,
    activeChannel: null as ChannelInfo | null,
    history: [] as number[], // history is based on ids
  }),

  actions: {
    setChannels(channels: ChannelInfo[] | null) {
      this.channels = channels
    },
    setActiveChannel(channel: ChannelInfo | null) {
      this.activeChannel = channel
      this.history.push(channel?.id || 0)
    },
    getActiveChannel() {
      return this.activeChannel
    },
    getChannels() {
      return this.channels
    },

    getChannelById(id: number) {
      return this.channels?.find((c: ChannelInfo) => c.id === id) || null
    },

    removeChannel(channelId: number) {
      this.channels =
        this.channels?.filter((c: ChannelInfo) => c.id !== channelId) || null

      this.history = this.history.filter((id: number) => id !== channelId)

      if (this.activeChannel?.id === channelId) {
        let newActiveChannel = null
        if (this.history.length > 0) {
          const lastChannel =
            this.history.length > 0 ? this.history[this.history.length - 1] : 0
          newActiveChannel =
            this.channels?.find((c: ChannelInfo) => c.id === lastChannel) ||
            null
          this.setActiveChannel(newActiveChannel)
        }
      }
    },
    isChannelSubscribed(id: number) {
      return this.channels?.some((c: ChannelInfo) => c.id === id) || false
    },
  },
})
