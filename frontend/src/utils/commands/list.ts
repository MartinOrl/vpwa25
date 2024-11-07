import { useCommandStore } from '@/stores/commandStore'
import { Events, type Command } from '../types/command'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: (args?: any[]) => {
    const channelId = args?.[0]
    const { callEvent } = useCommandStore()

    callEvent<number | null>({
      type: Events.ListChannelMembers,
      data: channelId || null,
    })
  },
}

export default listChannelsCommand
