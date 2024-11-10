import { useChannelStore } from '@/stores/channelStore'
import { ChannelInfo } from '../types/channel'
import type { Command } from '../types/command'

const channelStoreRef = useChannelStore()

const cancelChannelSubCommand: Command = {
  command: '/cancel',
  shadow: '/cancel',
  args: [],
  description: 'Cancel a channel subscription',
  example: '/cancel',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate: (args: any[]) => {
    const channelId = Number(args?.[0])

    return channelStoreRef.isChannelSubscribed(channelId)
  },
  allows: () => true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: (args?: any[]) => {
    const channelId = Number(args?.[0])
    if (channelId) {
      channelStoreRef.removeChannel(channelId)
    } else {
      const { id: activeChannelId } =
        channelStoreRef.getActiveChannel() as ChannelInfo
      channelStoreRef.removeChannel(activeChannelId)
    }
  },
}

export default cancelChannelSubCommand
