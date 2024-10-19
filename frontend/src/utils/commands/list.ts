import Command from '../types/command'

const listChannelsCommand: Command = {
  command: '/list',
  shadow: '/list',
  args: [],
  description: 'List members of channel',
  example: '/list',
  validate: () => {
    return true
  },
  allows: () => true,
}

export default listChannelsCommand
