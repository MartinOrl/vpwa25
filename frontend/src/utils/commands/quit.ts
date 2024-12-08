import { api } from '@/boot/axios'
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
  run: async () => {
    const { getActiveChannel, isChannelAdmin } = useChannelStore()

    const activeChannel = getActiveChannel()

    const isAdmin = isChannelAdmin(activeChannel?.id as number)

    if (!isAdmin) {
      console.log('You are not an admin of this channel')
      return
    }

    const res = await api.delete(`/channel/${activeChannel?.name}`)
    console.log('res', res)
  },
}

export default quitChannelCommand
