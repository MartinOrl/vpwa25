import type { Command } from '../types/command'

const inviteToChannelCommand: Command = {
  command: '/invite',
  shadow: '/invite @<nickname>',
  args: ['nickname'],
  description: 'Invite a user to a channel',
  example: '/invite @user',
  validate: (args: string[]) => {
    const user = args[0]
    if (!user) {
      throw new Error('User is required')
    }

    return true
  },
  allows: (arg: string) => inviteToChannelCommand.args.includes(arg),
  run: (args: string[]) => {
    console.log('Invite user to channel', args)
  },
}

export default inviteToChannelCommand
