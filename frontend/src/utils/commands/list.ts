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
