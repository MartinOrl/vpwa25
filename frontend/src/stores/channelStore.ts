import { defineStore } from 'pinia'
import {
  ChannelMetadata,
  ChannelPrivacy,
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

    updateUserKickCount(channelId: number, userId: number) {
      const channel = this.getChannelById(channelId)
      if (!channel) return
      const member = channel.members.find((m) => m.userId === userId)
      if (!member) return

      if (member.kickCount === 3) return
      member.kickCount += 1
      if (member.kickCount === 3) {
        member.role = ChannelRole.KICKED
      }
    },
    forceKickUser(channelId: number, userId: number) {
      const channel = this.getChannelById(channelId)
      if (!channel) return
      const member = channel.members.find((m) => m.userId === userId)
      if (!member) return

      member.role = ChannelRole.KICKED
    },
    restoreUser(channelId: number, userId: number) {
      const channel = this.getChannelById(channelId)
      if (!channel) return
      const member = channel.members.find((m) => m.userId === userId)
      if (!member) return

      member.role = ChannelRole.MEMBER
      member.kickCount = 0
    },

    matchChannel(channelName: string, privacy: ChannelPrivacy) {
      return this.channels?.find(
        (c: ChannelData) => c.name === channelName && c.privacy === privacy,
      )
    },
    getChannelMetadata(channelId: number) {
      return this.metadata.find((m) => m.channelId === channelId) || null
    },
    isChannelAdmin(channelId?: number) {
      const { user } = useAuthStore()
      const channel = channelId
        ? this.getChannelById(channelId)
        : this.activeChannel
      if (!channel || !user) return false
      const member = channel.members.find((m) => m.userId === user.id)
      return member?.role === ChannelRole.ADMIN
    },
    isChannelMember(channelId?: number) {
      const { user } = useAuthStore()
      const channel = channelId
        ? this.getChannelById(channelId)
        : this.activeChannel
      if (!channel || !user) return false
      return channel.members.some((m) => m.userId === user.id)
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

    getUserChannels(userId: number) {
      return this.channels?.filter((c: ChannelInfo) =>
        c.members.some((m) => m.userId === userId),
      )
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
            kickCount: 0,
          })
        }
      }
    },

    sendCustomMessage(channelId: number, message: ChannelMessage) {
      const channel = this.getChannelById(channelId)
      channel?.messages.push(message)
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
      console.log('removeChannel', channelId)
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
