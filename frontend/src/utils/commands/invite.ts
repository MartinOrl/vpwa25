import { useChannelStore } from '@/stores/channelStore'
import { usersTest } from '@/tmp/dummy'
import { ChannelPrivacy, ChannelRole } from '../types/channel'
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
  run: (args: string[]) => {
    const userToInvite = args[0].slice(1)

    const {
      addChannelMember,
      getActiveChannel,
      updateChannelMetadata,
      getChannelMetadata,
      isChannelAdmin,
      sendCustomMessage,
      restoreUser,
    } = useChannelStore()

    const matchedUser = usersTest.find((u) => u.nickName === userToInvite)

    if (!matchedUser) {
      return
    }

    const activeChannel = getActiveChannel()

    if (
      activeChannel?.privacy === ChannelPrivacy.PRIVATE &&
      !isChannelAdmin()
    ) {
      console.log('You are not an admin of this channel')
      return
    }

    const channelMember = activeChannel?.members.find(
      (m) => m.userId === matchedUser.id,
    )

    if (channelMember) {
      if (channelMember.role === ChannelRole.KICKED) {
        restoreUser(activeChannel?.id as number, matchedUser.id)
        sendCustomMessage(activeChannel?.id as number, {
          channelID: activeChannel?.id as number,
          senderID: 0,
          content: `${matchedUser.nickName} was restored to the channel`,
          timestamp: new Date().toISOString(),
          messageID: 100 + Math.floor(Math.random() * 1000),
        })
      }

      return
    }

    const existingChannelMetadata = getChannelMetadata(
      activeChannel?.id as number,
    )

    updateChannelMetadata(activeChannel?.id as number, {
      channelId: activeChannel?.id as number,
      isInvitation: true,
      notifications: existingChannelMetadata?.notifications || [],
    })

    sendCustomMessage(activeChannel?.id as number, {
      channelID: activeChannel?.id as number,
      senderID: 0,
      content: `${userToInvite} has been invited to the channel`,
      timestamp: new Date().toISOString(),
      messageID: 100 + Math.floor(Math.random() * 1000),
    })

    addChannelMember(activeChannel?.id || 0, matchedUser?.id || 0)
  },
}

export default inviteToChannelCommand
