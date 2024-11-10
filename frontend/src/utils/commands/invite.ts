import { useChannelStore } from '@/stores/channelStore'
import { usersTest } from '@/tmp/dummy'
import type { Command } from '../types/command'
import { CommandAllowRule } from '../types/misc'

const inviteToChannelCommand: Command = {
  command: '/invite',
  shadow: '/invite @<nickname>',
  args: [CommandAllowRule.NICKNAME],
  description: 'Invite a user to a channel',
  example: '/invite @user',
  validate: (args: string[]) => {
    const user = args[0]
    if (!user) {
      throw new Error('User is required')
    }

    return true
  },
  allows: (arg: CommandAllowRule) => inviteToChannelCommand.args.includes(arg),
  run: (args: string[]) => {
    console.log('Invite user to channel', args)
    const user = args[0].slice(1)

    const { addChannelMember, activeChannel } = useChannelStore()

    const userId = usersTest.find((u) => u.nickName === user)?.id

    if (!userId) {
      return
    }

    addChannelMember(activeChannel?.id || 0, userId || 0)
  },
}

export default inviteToChannelCommand
