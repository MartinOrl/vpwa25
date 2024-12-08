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

    const res = await api.post(
      `/channel/${activeChannel?.name.toLowerCase()}/invite`,
      {
        nickName: userToInvite,
      },
    )

    console.log('res', res)
    reloadMembers(activeChannel?.name as string)

    // const {
    //   addChannelMember,
    //   getActiveChannel,
    //   updateChannelMetadata,
    //   getChannelMetadata,
    //   isChannelAdmin,
    //   sendCustomMessage,
    //   restoreUser,
    // } = useChannelStore()

    // const matchedUser = usersTest.find((u) => u.nickName === userToInvite)

    // if (!matchedUser) {
    //   return
    // }

    // const activeChannel = getActiveChannel()

    // if (
    //   activeChannel?.privacy === ChannelPrivacy.PRIVATE &&
    //   !isChannelAdmin()
    // ) {
    //   console.log('You are not an admin of this channel')
    //   return
    // }

    // const channelMember = activeChannel?.members.find(
    //   (m) => m.userId === matchedUser.id,
    // )

    // if (channelMember) {
    //   if (channelMember.role === ChannelRole.KICKED) {
    //     restoreUser(activeChannel?.id as number, matchedUser.id)
    //     sendCustomMessage(activeChannel?.id as number, {
    //       channelId: activeChannel?.id as number,
    //       senderId: 0,
    //       content: `${matchedUser.nickName} was restored to the channel`,
    //       timestamp: new Date().toISOString(),
    //       messageId: 100 + Math.floor(Math.random() * 1000),
    //     })
    //   }

    //   return
    // }

    // const existingChannelMetadata = getChannelMetadata(
    //   activeChannel?.id as number,
    // )

    // updateChannelMetadata(activeChannel?.id as number, {
    //   channelId: activeChannel?.id as number,
    //   isInvitation: true,
    //   notifications: existingChannelMetadata?.notifications || [],
    // })

    // sendCustomMessage(activeChannel?.id as number, {
    //   channelId: activeChannel?.id as number,
    //   senderId: 0,
    //   content: `${userToInvite} has been invited to the channel`,
    //   timestamp: new Date().toISOString(),
    //   messageId: 100 + Math.floor(Math.random() * 1000),
    // })

    // addChannelMember(activeChannel?.id || 0, matchedUser?.id || 0)
  },
}

export default inviteToChannelCommand
