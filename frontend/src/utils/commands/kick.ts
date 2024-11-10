import type { Command } from '../types/command'
import { CommandAllowRule } from '../types/misc'

const kickUserCommand: Command = {
  command: '/kick',
  shadow: '/kick @<nickname>',
  args: [CommandAllowRule.NICKNAME],
  description: 'Kick user from a channel',
  example: '/kick @user',
  validate: (args: string[]) => {
    const user = args[0]
    if (!user) {
      throw new Error('User is required')
    }

    return true
  },
  allows: (arg: CommandAllowRule) => kickUserCommand.args.includes(arg),
  run: (args: string[]) => {
    console.log('Kick user from channel', args)
  },
}

export default kickUserCommand
