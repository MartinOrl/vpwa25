import { useChannelStore } from '@/stores/channelStore'
import { useCommandStore } from '@/stores/commandStore'
import { Events, type Command } from '../types/command'
import { CommandAllowRule } from '../types/misc'

const listChannelsCommand: Command = {
  command: '/list',
  shadow: '/list',
  args: [CommandAllowRule.CHANNEL],
  description: 'List members of channel',
  example: '/list',
  validate: () => {
    return true
  },
  allows: (arg: CommandAllowRule) => listChannelsCommand.args.includes(arg),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: async () => {
    const { callEvent } = useCommandStore()
    const { reloadMembers, getActiveChannel } = useChannelStore()
    const channelName = getActiveChannel()?.name as string
    await reloadMembers(channelName)

    callEvent<string | null>({
      type: Events.ListChannelMembers,
      data: channelName || null,
    })
  },
}

export default listChannelsCommand
