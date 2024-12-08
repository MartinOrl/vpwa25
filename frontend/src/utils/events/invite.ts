import {
  bindChannelMessageListener,
  useChannelStore,
} from '@/stores/channelStore'
import {
  ApiUser,
  ChannelData,
  ChannelMessage,
  ChannelMetadata,
  ChannelPrivacy,
  ChannelRole,
} from '../types/channel'
import { ServerEvent, ServerEventHandler } from '../types/misc'

type ServerChannelResponse = {
  channel: {
    id: number
    name: string
    ownerId: number
    privacy: ChannelPrivacy
    users: ApiUser[]
    messages: ChannelMessage[]
  }
}

export const ChannelInviteEvent: ServerEventHandler = {
  signature: 'channel:invite',
  handler: (event: ServerEvent) => {
    const { channel } = event.data as ServerChannelResponse
    const { addChannel, updateChannelMetadata } = useChannelStore()

    const members: ApiUser[] = []
    const memberIds: number[] = []
    channel.users.forEach((member) => {
      if (!memberIds.includes(member.id)) {
        members.push(member)
        memberIds.push(member.id)
      }
    })

    channel.users = members

    const channelObj: ChannelData = {
      id: channel.id,
      name: channel.name,
      privacy: channel.privacy,
      members: channel.users.map((user: ApiUser) => ({
        userId: user.id,
        role:
          user.id === channel.ownerId ? ChannelRole.ADMIN : ChannelRole.MEMBER,
        joinedAt: '',
        kickCount: 0,
      })),
      messages: channel.messages,
    }

    const meta: ChannelMetadata = {
      channelId: channel.id,
      notifications: [],
      isInvitation: true,
    }
    console.log('Adding channel:', channelObj)

    addChannel(channelObj, false)
    updateChannelMetadata(channel.id, meta)

    bindChannelMessageListener(channel.id)
  },
}
