import { api } from '@/boot/axios'
import { useChannelStore } from '@/stores/channelStore'
import type { Command } from '../types/command'

const quitChannelCommand: Command = {
  command: '/quit',
  shadow: '/quit',
  args: ['channelId'],
  description: 'Close the channel',
  example: '/quit',
  validate: () => {
    return true
  },
  allows: () => true,
  run: async (args?: unknown[]) => {
    const channelId = args?.[0] as number
    const { getActiveChannel, isChannelAdmin, getChannelById } =
      useChannelStore()
    console.log('Quit channel', channelId)
    const activeChannel = getActiveChannel()
    const channel = channelId ? getChannelById(channelId) : activeChannel

    console.log('channel', channel)

    const isAdmin = isChannelAdmin(channel?.id as number)

    if (!isAdmin) {
      console.log('You are not an admin of this channel')
      return
    }

    const res = await api.delete(`/channel/${channel?.name}`)
    console.log('res', res)
  },
}

export default quitChannelCommand
