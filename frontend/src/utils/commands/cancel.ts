import Command from '../types/command'

const cancelChannelSubCommand: Command = {
  command: '/cancel',
  shadow: '/cancel',
  args: [],
  description: 'Cancel a channel subscription',
  example: '/cancel',
  validate: () => {
    return true
  },
  allows: () => true,
}

export default cancelChannelSubCommand
