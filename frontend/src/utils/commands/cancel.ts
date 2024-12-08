import { api } from '@/boot/axios'
import { useChannelStore } from '@/stores/channelStore'
import { type Command } from '../types/command'

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
  run: async (args?: any[]) => {
    console.log('Cancel channel subscription', args)
    const { getActiveChannel } = useChannelStore()
    const channelToLeave = args?.[0] || getActiveChannel()?.name

    const _res = await api.post(`/channel/${channelToLeave}/leave`)
  },
}

export default cancelChannelSubCommand
