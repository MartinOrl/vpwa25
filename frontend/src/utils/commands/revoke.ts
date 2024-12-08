import { api } from '@/boot/axios'
import { useChannelStore } from '@/stores/channelStore'
import type { Command } from '../types/command'
import { CommandAllowRule } from '../types/misc'

const revokeFromChannelCommand: Command = {
  command: '/revoke',
  shadow: '/revoke @<nickname>',
  args: [CommandAllowRule.NICKNAME],
  description: 'Revoke kicked user',
  example: '/revoke @user',
  validate: (args: string[]) => {
    const user = args[0]
    if (!user) {
      throw new Error('User is required')
    }

    return true
  },
  allows: (arg: CommandAllowRule) =>
    revokeFromChannelCommand.args.includes(arg),
  run: async (args: string[]) => {
    console.log('Revoke user from channel', args)
    const userToRevoke = args[0].slice(1)
    const { getActiveChannel } = useChannelStore()

    const res = await api.post('/channel/revoke', {
      userName: userToRevoke,
      channelName: getActiveChannel()?.name,
    })
    console.log('res', res)

    // const { getActiveChannel, isChannelAdmin, removeChannelMember } =
    //   useChannelStore()

    // const activeChannel = getActiveChannel()

    // if (!activeChannel) {
    //   return
    // }

    // const userToRevoke = args[0].slice(1)

    // if (activeChannel.privacy === ChannelPrivacy.PRIVATE && !isChannelAdmin()) {
    //   console.log('You are not an admin of this channel')
    //   return
    // }

    // const userMatch = usersTest.find((u) => u.nickName === userToRevoke)
    // if (!userMatch) {
    //   return
    // }

    // const userId = userMatch.id

    // removeChannelMember(activeChannel.id, userId)
  },
}

export default revokeFromChannelCommand
