import { useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { ChannelPrivacy, ChannelRole } from '../types/channel'
import type { Command } from '../types/command'
import { CommandAllowRule } from '../types/misc'

const joinChannelCommand: Command = {
  command: '/join',
  shadow: '/join <name> <private | public>',
  args: ['privacy'],
  description: 'Join or create a channel ',
  example: '/join general public',
  validate: (args: string[]) => {
    const privacyArg = args[1]
    const privacy =
      privacyArg && privacyArg.toUpperCase() === ChannelPrivacy.PRIVATE
        ? ChannelPrivacy.PRIVATE
        : ChannelPrivacy.PUBLIC

    const channelName = args[0]
    if (
      privacy &&
      privacy !== ChannelPrivacy.PUBLIC &&
      privacy !== ChannelPrivacy.PRIVATE
    ) {
      console.log('Privacy:', privacy)
      throw new Error('Privacy must be public or private')
    }
    if (!channelName) {
      throw new Error('Channel name is required')
    }

    return true
  },
  allows: (arg: CommandAllowRule) => joinChannelCommand.args.includes(arg),
  run: (args: string[]) => {
    console.log('Join channel', args)
    const { user } = useAuthStore()
    let channelName = args[0]
    if (channelName.startsWith('#')) {
      channelName = channelName.slice(1)
    }
    const privacyArg = args[1]
    const privacy =
      privacyArg && privacyArg.toUpperCase() === ChannelPrivacy.PRIVATE
        ? ChannelPrivacy.PRIVATE
        : ChannelPrivacy.PUBLIC

    const {
      matchChannel,
      addChannel,
      addChannelMember,
      sendCustomMessage,
      setActiveChannel,
      isChannelMember,
    } = useChannelStore()

    const channel = matchChannel(channelName, privacy)

    const channelsWithSameName =
      matchChannel(channelName, ChannelPrivacy.PRIVATE) ||
      matchChannel(channelName, ChannelPrivacy.PUBLIC)

    if (channel) {
      if (channel.privacy === ChannelPrivacy.PUBLIC) {
        if (isChannelMember(channel.id)) {
          return
        }

        addChannelMember(channel.id, user?.id as number)
        sendCustomMessage(channel.id, {
          channelID: channel.id,
          senderID: 0,
          content: `${user?.nickName} has joined the channel`,
          timestamp: new Date().toISOString(),
          messageID: 100 + Math.floor(Math.random() * 1000),
        })
        setActiveChannel(channel)
      }
    } else {
      if (channelsWithSameName) {
        return
      }
      const channelObj = {
        id: 100 + Math.floor(Math.random() * 1000),
        name: channelName,
        privacy: privacy,
        slug: channelName.toLowerCase().replace(' ', '-'),
        members: [
          {
            userId: user?.id || 0,
            role: ChannelRole.ADMIN,
            joinedAt: new Date().toISOString(),
            kickCount: 0,
          },
        ],
        messages: [],
      }
      addChannel(channelObj)
      sendCustomMessage(channelObj.id, {
        channelID: channelObj.id,
        senderID: 0,
        content: `${user?.nickName} created the channel`,
        timestamp: new Date().toISOString(),
        messageID: 100 + Math.floor(Math.random() * 1000),
      })
    }
  },
}

export default joinChannelCommand
