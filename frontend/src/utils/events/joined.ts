import {
  bindChannelMessageListener,
  useChannelStore,
} from '@/stores/channelStore'
import {
  ApiUser,
  ChannelData,
  ChannelMessage,
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

export const ChannelJoinedEvent: ServerEventHandler = {
  signature: 'channel:joined',
  handler: (event: ServerEvent) => {
    const { channel } = event.data as ServerChannelResponse
    const { addChannel } = useChannelStore()

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
    console.log('joined', channelObj)
    bindChannelMessageListener(channel.id)
    addChannel(channelObj)
  },
}
