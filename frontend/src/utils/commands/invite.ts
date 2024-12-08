import { api } from '@/boot/axios'
import { useChannelStore } from '@/stores/channelStore'
import { MatchUsersList, type Command } from '../types/command'
import { CommandAllowRule } from '../types/misc'

const inviteToChannelCommand: Command = {
  command: '/invite',
  usersMatch: MatchUsersList.OTHERS,
  shadow: '/invite @<nickname>',
  args: [CommandAllowRule.NICKNAME],
  description: 'Invite a user to a channel',
  example: '/invite @user',
  validate: (args: string[]) => {
    const user = args[0]
    if (!user) {
      throw new Error('User is required')
    }

    return true
  },
  allows: (arg: CommandAllowRule) => inviteToChannelCommand.args.includes(arg),
  run: async (args: string[]) => {
    const userToInvite = args[0].slice(1)
    const { getActiveChannel, reloadMembers } = useChannelStore()
    const activeChannel = getActiveChannel()

    const _res = await api.post(
      `/channel/${activeChannel?.name.toLowerCase()}/invite`,
      {
        nickName: userToInvite,
      },
    )

    reloadMembers(activeChannel?.name as string)
  },
}

export default inviteToChannelCommand
