import { useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { ChannelData, ChannelPrivacy, ChannelRole } from '../types/channel'
import type { Command } from '../types/command'
import { CommandAllowRule } from '../types/misc'

const joinChannelCommand: Command = {
  command: '/join',
  shadow: '/join <name> <private | public>',
  args: ['privacy'],
  description: 'Join or create a channel ',
  example: '/join general public',
  validate: (args: string[]) => {
    const privacy = args[1].toUpperCase() || ChannelPrivacy.PUBLIC

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

    const privacy =
      (args[1].toUpperCase() as ChannelPrivacy) || ChannelPrivacy.PUBLIC

    const { addChannel } = useChannelStore()
    const { user } = useAuthStore()
    const channelObj: ChannelData = {
      id: 100 + Math.floor(Math.random() * 1000),
      name: args[0],
      privacy: privacy,
      slug: args[0].toLowerCase().replace(' ', '-'),
      members: [
        {
          userId: user?.id || 0,
          role: ChannelRole.ADMIN,
          joinedAt: new Date().toISOString(),
        },
      ],
      messages: [],
    }

    addChannel(channelObj)
  },
}

export default joinChannelCommand
