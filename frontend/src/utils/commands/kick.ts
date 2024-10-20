import Command from '../types/command'

const kickUserCommand: Command = {
  command: '/kick',
  shadow: '/kick @<nickname>',
  args: ['nickname'],
  description: 'Kick user from a channel',
  example: '/kick @user',
  validate: (args: string[]) => {
    const user = args[0]
    if (!user) {
      throw new Error('User is required')
    }

    return true
  },
  allows: (arg: string) => kickUserCommand.args.includes(arg),
}

export default kickUserCommand
