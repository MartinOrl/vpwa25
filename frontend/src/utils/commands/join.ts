import { ChannelPrivacy } from '../types/channel'
import Command from '../types/command'

const joinChannelCommand: Command = {
  command: '/join',
  shadow: '/join <name> <private | public>',
  args: ['channel', 'privacy'],
  description: 'Join or create a channel ',
  example: '/join general public',
  validate: (args: string[]) => {
    const privacy = args[1] || 'public'
    const channelName = args[0]
    if (
      privacy !== ChannelPrivacy.PUBLIC &&
      privacy !== ChannelPrivacy.PRIVATE
    ) {
      throw new Error('Privacy must be public or private')
    }
    if (!channelName) {
      throw new Error('Channel name is required')
    }

    return true
  },
  allows: (arg: string) => joinChannelCommand.args.includes(arg),
}

export default joinChannelCommand
