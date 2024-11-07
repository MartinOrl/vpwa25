import type { Command } from '../types/command'

const revokeFromChannelCommand: Command = {
  command: '/revoke',
  shadow: '/revoke @<nickname>',
  args: ['nickname'],
  description: 'Revoke a user from a channel',
  example: '/revoke @user',
  validate: (args: string[]) => {
    const user = args[0]
    if (!user) {
      throw new Error('User is required')
    }

    return true
  },
  allows: (arg: string) => revokeFromChannelCommand.args.includes(arg),
  run: (args: string[]) => {
    console.log('Revoke user from channel', args)
  },
}

export default revokeFromChannelCommand
