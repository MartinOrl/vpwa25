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
    const { getActiveChannel } = useChannelStore()

    const res = await api.post('/channel/kick', {
      userName: userToKick,
      channelName: getActiveChannel()?.name,
    })

    console.log('res', res)

    // const {
    //   getActiveChannel,
    //   forceKickUser,
    //   sendCustomMessage,
    //   isChannelAdmin,
    //   updateUserKickCount,
    // } = useChannelStore()

    // const matchedUser = usersTest.find((u) => u.nickName === userToKick)

    // if (!matchedUser) {
    //   return
    // }

    // const activeChannel = getActiveChannel()

    // if (!activeChannel) {
    //   return
    // }

    // const channelMember = activeChannel.members.find(
    //   (m) => m.userId === matchedUser.id,
    // )

    // if (isChannelAdmin(activeChannel.id)) {
    //   console.log('You are an admin of this channel')
    //   forceKickUser(activeChannel.id, matchedUser.id)
    //   sendCustomMessage(activeChannel.id, {
    //     channelId: activeChannel.id,
    //     senderId: 0,
    //     content: `${matchedUser.nickName} was kicked from the channel`,
    //     timestamp: new Date().toISOString(),
    //     messageId: 100 + Math.floor(Math.random() * 1000),
    //   })

    //   return
    // }

    // if (channelMember?.role === ChannelRole.ADMIN) return

    // const kickCount = channelMember?.kickCount || 0
    // if (kickCount === 3) return

    // if (kickCount === 2) {
    //   sendCustomMessage(activeChannel.id, {
    //     channelId: activeChannel.id,
    //     senderId: 0,
    //     content: `${matchedUser.nickName} was kicked from the channel`,
    //     timestamp: new Date().toISOString(),
    //     messageId: 100 + Math.floor(Math.random() * 1000),
    //   })
    // } else {
    //   sendCustomMessage(activeChannel.id, {
    //     channelId: activeChannel.id,
    //     senderId: 0,
    //     content: `${matchedUser.nickName} kick count increased to ${
    //       kickCount + 1
    //     }`,
    //     timestamp: new Date().toISOString(),
    //     messageId: 100 + Math.floor(Math.random() * 1000),
    //   })
    // }
    // updateUserKickCount(activeChannel.id, matchedUser.id)

    // if (
    //   activeChannel?.privacy === ChannelPrivacy.PRIVATE &&
    //   !isChannelAdmin()
    // ) {
    //   console.log('You are not an admin of this channel')
    //   return
    // }

    // removeChannelMember(activeChannel?.id as number, matchedUser.id)

    // sendCustomMessage(activeChannel?.id as number, {
    //   channelID: activeChannel?.id as number,
    //   senderID: 0,
    //   content: `${matchedUser.nickName} was kicked from the channel`,
    //   timestamp: new Date().toISOString(),
    //   messageID: 100 + Math.floor(Math.random() * 1000),
    // })
  },
}

export default kickUserCommand
