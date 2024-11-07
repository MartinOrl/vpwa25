import type { Command } from '../types/command'

const quitChannelCommand: Command = {
  command: '/quit',
  shadow: '/quit',
  args: [],
  description: 'Close the channel',
  example: '/quit',
  validate: () => {
    return true
  },
  allows: () => true,
  run: () => {
    console.log('Close the channel')
  },
}

export default quitChannelCommand
