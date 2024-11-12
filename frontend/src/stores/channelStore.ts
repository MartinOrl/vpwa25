import { defineStore } from 'pinia'
import {
  ChannelMetadata,
  ChannelRole,
  type ChannelData,
  type ChannelInfo,
  type ChannelMessage,
} from '@/utils/types/channel'
import { useAuthStore } from './authStore'

export const useChannelStore = defineStore('channel', {
  state: () => ({
    channels: [] as ChannelData[] | null,
    activeChannel: null as ChannelData | null,
    history: [] as number[],
    metadata: [] as ChannelMetadata[],
  }),

  actions: {
    setChannels(channels: ChannelData[] | null) {
      this.channels = channels
    },
    setActiveChannel(channel: ChannelData | null) {
      this.activeChannel = channel
      this.history.push(channel?.id || 0)
    },
    getActiveChannel() {
      return this.activeChannel
    },
    updateChannelMetadata(channelId: number, metadata: ChannelMetadata) {
      console.log('metadata', metadata)
      console.log('channelId', channelId)
      const index = this.metadata.findIndex((m) => m.channelId === channelId)
      if (index >= 0) {
        this.metadata[index] = metadata
      } else {
        this.metadata.push(metadata)
      }
    },
    getChannelMetadata(channelId: number) {
      return this.metadata.find((m) => m.channelId === channelId) || null
    },
    getChannels() {
      return this.channels
    },

    getChannelById(id: number) {
      return this.channels?.find((c: ChannelInfo) => c.id === id) || null
    },

    getChannelMessages() {
      return this.activeChannel?.messages || []
    },

    addChannel(channel: ChannelData) {
      this.channels?.push(channel)
      this.setActiveChannel(channel)
    },

    removeChannelMember(channelId: number, userId: number) {
      const channel = this.channels?.find(
        (c: ChannelInfo) => c.id === channelId,
      )
      if (channel) {
        channel.members = channel.members.filter((m) => m.userId !== userId)
      }
    },

    addChannelMember(channelId: number, userId: number) {
      const channel = this.channels?.find(
        (c: ChannelInfo) => c.id === channelId,
      )
      if (channel) {
        if (!channel.members.some((m) => m.userId === userId)) {
          channel.members.push({
            userId,
            role: ChannelRole.MEMBER,
            joinedAt: new Date().toISOString(),
          })
        }
      }
    },

    processSendMessage(message: string) {
      const { user } = useAuthStore()

      const messageObj: ChannelMessage = {
        channelID: this.activeChannel?.id || 0,
        content: message,
        messageID: 100 + Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString(),
        senderID: user?.id || 0,
      }

      console.log('messageObj', messageObj)

      this.activeChannel?.messages.push(messageObj)
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
