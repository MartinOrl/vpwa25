import { useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { type Command } from '../types/command'

const channelStoreRef = useChannelStore()

const cancelChannelSubCommand: Command = {
  command: '/cancel',
  shadow: '/cancel',
  args: [],
  description: 'Cancel a channel subscription',
  example: '/cancel',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // validate: (args: any[]) => {
  //   const channelId = Number(args?.[0])

  //   return channelStoreRef.isChannelSubscribed(channelId)
  // },
  validate: () => true,
  allows: () => true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: (args?: any[]) => {
    console.log('Cancel channel subscription', args)
    const channelToLeave = Number(args?.[0])
    const { user } = useAuthStore()

    const { getChannelById, getActiveChannel, sendCustomMessage } =
      channelStoreRef

    const channel = channelToLeave
      ? getChannelById(channelToLeave)
      : getActiveChannel()

    console.log('Channel to leave', channel)
    if (!channel) {
      return
    }

    const otherChannels = channelStoreRef
      .getUserChannels(user?.id as number)
      ?.filter((c) => c.id !== channel.id)
    const isAdmin = channelStoreRef.isChannelAdmin(channel.id)
    if (isAdmin) {
      channelStoreRef.removeChannel(channel.id)
    } else {
      channelStoreRef.removeChannelMember(channel.id, user?.id as number)
      if (otherChannels?.length) {
        channelStoreRef.setActiveChannel(otherChannels[0])
      }
      sendCustomMessage(channel.id, {
        channelID: channel.id,
        senderID: 0,
        content: `${user?.nickName} has left the channel`,
        timestamp: new Date().toISOString(),
        messageID: 100 + Math.floor(Math.random() * 1000),
      })
    }
  },
}

export default cancelChannelSubCommand
