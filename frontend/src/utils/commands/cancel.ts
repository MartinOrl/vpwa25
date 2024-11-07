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
  validate: (channelId: number) => {
    return channelStoreRef.isChannelSubscribed(channelId)
  },
  allows: () => true,
  run: (channelId?: number) => {
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
