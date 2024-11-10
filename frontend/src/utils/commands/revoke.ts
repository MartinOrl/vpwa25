import type { Command } from '../types/command'
import { CommandAllowRule } from '../types/misc'

const revokeFromChannelCommand: Command = {
  command: '/revoke',
  shadow: '/revoke @<nickname>',
  args: [CommandAllowRule.NICKNAME],
  description: 'Revoke a user from a channel',
  example: '/revoke @user',
  validate: (args: string[]) => {
    const user = args[0]
    if (!user) {
      throw new Error('User is required')
    }

    return true
  },
  allows: (arg: CommandAllowRule) =>
    revokeFromChannelCommand.args.includes(arg),
  run: (args: string[]) => {
    console.log('Revoke user from channel', args)
  },
}

export default revokeFromChannelCommand
