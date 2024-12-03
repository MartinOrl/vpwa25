import { useChannelStore } from '@/stores/channelStore'
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
    const { getActiveChannel, isChannelAdmin, removeChannel } =
      useChannelStore()

    const activeChannel = getActiveChannel()

    const isAdmin = isChannelAdmin(activeChannel?.id as number)

    if (!isAdmin) {
      console.log('You are not an admin of this channel')
      return
    }

    removeChannel(activeChannel?.id as number)
  },
}

export default quitChannelCommand
