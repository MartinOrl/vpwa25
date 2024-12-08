import { api } from '@/boot/axios'
import { useChannelStore } from '@/stores/channelStore'
import { MatchUsersList, type Command } from '../types/command'
import { CommandAllowRule } from '../types/misc'

const kickUserCommand: Command = {
  command: '/kick',
  usersMatch: MatchUsersList.MEMBERS,
  shadow: '/kick @<nickname>',
  args: [CommandAllowRule.NICKNAME],
  description: 'Kick user from a channel',
  example: '/kick @user',
  validate: (args: string[]) => {
    const user = args[0]
    if (!user) {
      throw new Error('User is required')
    }

    return true
  },
  allows: (arg: CommandAllowRule) => kickUserCommand.args.includes(arg),
  run: async (args: string[]) => {
    const userToKick = args[0].slice(1)
    const { getActiveChannel, reloadMembers } = useChannelStore()

    const _res = await api.post('/channel/kick', {
      userName: userToKick,
      channelName: getActiveChannel()?.name,
    })

    reloadMembers(getActiveChannel()?.name as string)
  },
}

export default kickUserCommand
