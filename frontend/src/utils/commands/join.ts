import { api } from '@/boot/axios'
import { ChannelPrivacy } from '../types/channel'
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
  run: async (args: string[]) => {
    console.log('Join channel', args)
    let channelName = args[0]
    if (channelName.startsWith('#')) {
      channelName = channelName.slice(1)
    }
    const privacyArg = args[1]
    const privacy =
      privacyArg && privacyArg.toUpperCase() === ChannelPrivacy.PRIVATE
        ? ChannelPrivacy.PRIVATE
        : ChannelPrivacy.PUBLIC

    await api.post('/channel/join', {
      name: channelName,
      privacy,
    })
  },
}

export default joinChannelCommand
