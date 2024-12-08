import { Subscription } from '@adonisjs/transmit-client'
import { defineStore } from 'pinia'
import qs from 'qs'
import { api } from '@/boot/axios'
import { backendTransmit } from '@/boot/transmit'
import processUserEvent from '@/utils/events/events'
import { notify } from '@/utils/notify'
import {
  ChannelMember,
  ChannelMetadata,
  ChannelPrivacy,
  ChannelRole,
  type ChannelData,
  type ChannelInfo,
  type ChannelMessage,
} from '@/utils/types/channel'
import { ServerEvent } from '@/utils/types/misc'
import { User, UserStatus } from '@/utils/types/user'
import { useAuthStore } from './authStore'
import { useUsersStore } from './usersStore'

let eventSub: Subscription | null = null
const messageSubs: Record<number, Subscription> = {}

export const bindEventListener = async (userId: number) => {
  if (!userId) return
  console.log('Attaching default listeners for user:', userId)
  eventSub = backendTransmit.subscription(`events/user/${userId}`)
  if (!eventSub.isCreated) {
    await eventSub.create()
  }

  eventSub.onMessage((message: string) => {
    const event: ServerEvent = JSON.parse(message)
    console.log('Received event:', event)
    processUserEvent(event)
  })
}

export const unbindEventListener = () => {
  if (eventSub) {
    eventSub.delete()
    eventSub = null
  }
}

export const bindChannelMessageListener = (channelId: number) => {
  if (!channelId) return
  const { addMessageToChannel } = useChannelStore()
  const { user } = useAuthStore()
  // Block offline users from receiving messages
  if (!user || user.status === UserStatus.OFFLINE) return

  messageSubs[channelId] = backendTransmit.subscription(`chat/${channelId}`)
  if (!messageSubs[channelId].isCreated) {
    messageSubs[channelId].create()
  }

  messageSubs[channelId].onMessage((message: string) => {
    const { event, data } = JSON.parse(message)

    console.log('Received message:', message)

    if (event === 'message:new') {
      const _message = data as ChannelMessage

      if (
        _message.content.includes('has joined the channel') ||
        _message.content.includes('has left') ||
        _message.content.includes('has been kicked from the channel') ||
        _message.content.includes('has invited')
      ) {
        const store = useChannelStore()
        store.reloadMembers(store.activeChannel?.name as string)
      }

      console.log('Received message:', message)
      addMessageToChannel(channelId, _message)
      const { findUserById } = useUsersStore()
      const sender = findUserById(_message.senderId)?.nickName
      if (sender) {
        const _a = document.visibilityState
        if (_a === 'hidden') {
          notify(_message.content, sender as string)
        }
      }
    } else if (event === 'status:update') {
      const { updateUserStatus } = useUsersStore()
      const { id, status } = data as User
      updateUserStatus(id, status)
    }
  })
}

export const unbindChannelMessageListener = (channelId: number) => {
  if (messageSubs[channelId]) {
    messageSubs[channelId].delete()
    delete messageSubs[channelId]
  }
}

export const useChannelStore = defineStore('channel', {
  state: () => ({
    channels: [] as ChannelData[] | null,
    activeChannel: null as ChannelData | null,
    history: [] as number[],
    metadata: [] as ChannelMetadata[],
    pagination: {
      page: 1,
      limit: 35,
    },
  }),

  actions: {
    setChannels(channels: ChannelData[] | null) {
      this.channels = channels
    },
    detach() {
      this.channels?.forEach((c) => unbindChannelMessageListener(c.id))
      unbindEventListener()
    },
    async reattach() {
      const authStore = useAuthStore()
      await authStore.loadUser()
    },

    findChannelByName(channelName: string) {
      return this.channels?.find((c) => c.name === channelName) || null
    },

    async reloadMembers(channelName: string) {
      const res = await api.get(`/channel/${channelName}/users`)
      const usersStore = useUsersStore()
      const users = res.data
      const channelMembers = this.channels?.find(
        (c) => c.name === channelName,
      )?.members

      const nonMembers = channelMembers?.filter(
        (m) => !users.find((u: User) => u.id === m.userId),
      )
      nonMembers?.forEach((m) => {
        this.removeChannelMember(this.activeChannel?.id as number, m.userId)
      })

      users.forEach((user: User) => {
        usersStore.addOrUpdateUser(user)
        const _m = {
          userId: user.id,
          role:
            channelMembers?.find((m) => m.userId === user.id)?.role ||
            ChannelRole.MEMBER,
          joinedAt: new Date().toISOString(),
          kickCount: 0,
        }
        this.addOrUpdateChannelMember(this.activeChannel?.id as number, _m)
      })
    },

    async load() {
      this.reloadMembers(this.activeChannel?.name as string)
      this.loadMessages()
    },

    async loadMessages() {
      const query = qs.stringify({
        page: this.pagination.page,
        limit: this.pagination.limit,
      })
      const res = await api.get(
        `/channel/${this.activeChannel?.name.toLowerCase()}/messages?${query}`,
      )
      console.log('res', res)
      this.setMessages(
        this.activeChannel?.id as number,
        res.data.data.reverse(),
      )
    },

    addOrUpdateChannelMember(channelId: number, member: ChannelMember) {
      const channel = this.channels?.find((c) => c.id === channelId)
      if (!channel) return
      const index = channel.members.findIndex((m) => m.userId === member.userId)
      if (index >= 0) {
        channel.members[index] = member
      } else {
        channel.members.push(member)
      }
    },

    setActiveChannel(channel: ChannelData | null) {
      this.activeChannel = channel
      this.history.push(channel?.id || 0)
    },
    addMessage(message: ChannelMessage) {
      console.log(this.activeChannel)
      this.activeChannel?.messages.push(message)
      this.channels
        ?.find((c) => c.id === this.activeChannel?.id)
        ?.messages.push(message)
    },
    setMessages(channelId: number, messages: ChannelMessage[]) {
      const channel = this.channels?.find((c) => c.id === channelId)
      if (channel) {
        channel.messages = messages
      }
      if (this.activeChannel?.id === channelId) {
        this.activeChannel = channel || null
      }
    },
    addMessageToChannel(channelId: number, message: ChannelMessage) {
      const channel = this.channels?.find((c) => c.id === channelId) || null
      console.log(message)
      console.log(channel?.messages)
      if (!channel?.messages.find((m) => m.id == message.id)) {
        channel?.messages.push(message)
      }
      if (this.activeChannel?.id === channelId) {
        this.activeChannel = channel
      }
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
      console.log('member', member)
      return member?.role === ChannelRole.ADMIN
    },
    isChannelMember(channelId?: number, userId?: number) {
      const channel = channelId
        ? this.getChannelById(channelId)
        : this.activeChannel
      if (!channel || !userId) return false
      return channel.members.some((m) => m.userId === userId)
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

    addChannel(channel: ChannelData, setActive = true) {
      console.log('addChannel', channel)
      if (this.channels?.find((c) => c.id === channel.id)) return

      this.channels?.push(channel)
      if (setActive) {
        this.setActiveChannel(channel)
      }
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

    async processSendMessage(message: string) {
      const res = await api.post('/channel/messages', {
        content: message,
        channelID: this.activeChannel?.id || 0,
      })

      console.log('res', res)

      // this.activeChannel?.messages.push(messageObj)
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
        } else {
          newActiveChannel = this.channels?.[0] || null
          this.setActiveChannel(newActiveChannel)
        }
      }
    },
    isChannelSubscribed(id: number) {
      return this.channels?.some((c: ChannelInfo) => c.id === id) || false
    },
  },
})
