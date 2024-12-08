import { defineStore } from 'pinia'
import { api } from '@/boot/axios'
import { ApiUser, ChannelMessage, ChannelRole } from '@/utils/types/channel'
import { User, UserStatus } from '@/utils/types/user'
import {
  bindChannelMessageListener,
  bindEventListener,
  unbindEventListener,
  useChannelStore,
} from './channelStore'
import { useUsersStore } from './usersStore'

// let eventSub: Subscription | null = null
// const messageSubs: Record<number, Subscription> = {}

// const attachDefaultEventListener = async (userId: number) => {
//   if (!userId) return
//   console.log('Attaching default listeners for user:', userId)
//   const { addChannel, removeChannel, updateChannelMetadata } = useChannelStore()

//   eventSub = backendTransmit.subscription(`events/user/${userId}`)
//   if (!eventSub.isCreated) {
//     await eventSub.create()
//   }
//   eventSub.onMessage((message: string) => {
//     console.log('Received message:', JSON.parse(message))
//     const messageObj: ServerEvent = JSON.parse(message)
//     const eventType = messageObj.event
//     let fn = () => {}
//     switch (eventType) {
//       case 'channel:joined':
//         fn = () => {
//           const { channel } = messageObj.data as {
//             channel: {
//               id: number
//               name: string
//               ownerId: number
//               privacy: ChannelPrivacy
//               users: ApiUser[]
//               messages: ChannelMessage[]
//             }
//           }

//           // remove duplicate members
//           const members: ApiUser[] = []
//           const memberIds: number[] = []
//           channel.users.forEach((member) => {
//             if (!memberIds.includes(member.id)) {
//               members.push(member)
//               memberIds.push(member.id)
//             }
//           })

//           channel.users = members

//           const channelObj: ChannelData = {
//             id: channel.id,
//             name: channel.name,
//             privacy: channel.privacy,
//             members: channel.users.map((user: ApiUser) => ({
//               userId: user.id,
//               role:
//                 user.id === channel.ownerId
//                   ? ChannelRole.ADMIN
//                   : ChannelRole.MEMBER,
//               joinedAt: '',
//               kickCount: 0,
//             })),
//             messages: channel.messages,
//           }
//           bindChannelMessageListener(channel.id)
//           addChannel(channelObj)
//         }
//         break
//       case 'channel:leave':
//         fn = () => {
//           const channelId = messageObj.data as number
//           console.log('Removing channel:', channelId)
//           removeChannel(channelId as number)
//           unbindChannelMessageListener(channelId)
//         }
//         break
//       case 'channel:invite':
//         console.log('Invitation received:', messageObj.data)
//         fn = () => {
//           const { channel } = messageObj.data as {
//             channel: {
//               id: number
//               name: string
//               ownerId: number
//               privacy: ChannelPrivacy
//               users: ApiUser[]
//               messages: ChannelMessage[]
//             }
//           }

//           // remove duplicate members
//           const members: ApiUser[] = []
//           const memberIds: number[] = []
//           channel.users.forEach((member) => {
//             if (!memberIds.includes(member.id)) {
//               members.push(member)
//               memberIds.push(member.id)
//             }
//           })

//           channel.users = members

//           const channelObj: ChannelData = {
//             id: channel.id,
//             name: channel.name,
//             privacy: channel.privacy,
//             members: channel.users.map((user: ApiUser) => ({
//               userId: user.id,
//               role:
//                 user.id === channel.ownerId
//                   ? ChannelRole.ADMIN
//                   : ChannelRole.MEMBER,
//               joinedAt: '',
//               kickCount: 0,
//             })),
//             messages: channel.messages,
//           }

//           const meta: ChannelMetadata = {
//             channelId: channel.id,
//             notifications: [],
//             isInvitation: true,
//           }
//           console.log('Adding channel:', channelObj)

//           addChannel(channelObj, false)
//           updateChannelMetadata(channel.id, meta)

//           bindChannelMessageListener(channel.id)
//         }
//         break
//       default:
//         fn = () => {}
//         break
//     }

//     fn()

//     if (eventType === 'channel:joined') {
//     } else if (eventType === 'channel:leave') {
//       const channelId = messageObj.data as number
//       console.log('Removing channel:', channelId)
//       removeChannel(channelId as number)
//       unbindChannelMessageListener(channelId)
//     }
//   })
// }

// const attachDefaultMessageListener = async (channelId: number) => {
//   if (!channelId) return
//   console.log('Attaching default message listeners for channel:', channelId)
//   const { addMessageToChannel } = useChannelStore()

//   messageSubs[channelId] = backendTransmit.subscription(`chat/${channelId}`)
//   if (!messageSubs[channelId].isCreated) {
//     await messageSubs[channelId].create()
//   }

//   messageSubs[channelId].onMessage((message: ChannelMessage) => {
//     console.log('Received message:', message)
//     addMessageToChannel(message.channelId, message)
//   })
// }

// const detachDefaultMessageListener = async (channelId: number) => {
//   console.log('Detaching default message listeners')
//   if (messageSubs[channelId]) {
//     await messageSubs[channelId].delete()

//     delete messageSubs[channelId]
//   }
// }

// const detachDefaultEventListener = async () => {
//   if (eventSub) {
//     console.log('Detaching default listeners')
//     await eventSub.delete()
//   }
// }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => {
      if (localStorage.getItem('user')) {
        return true
      } else {
        return !!state.user
      }
    },
  },
  actions: {
    login(user: User, token: string) {
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      // attachDefaultEventListener(user.id)
      bindEventListener(user.id)
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // detachDefaultEventListener()
      unbindEventListener()
      const channelStore = useChannelStore()
      channelStore.detach()
    },
    updateStatus(status: UserStatus) {
      if (this.user) {
        this.user.status = status
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },
    isOffline() {
      if (this.user) {
        return this.user.status === UserStatus.OFFLINE
      }
      return true
    },
    async loadUser() {
      const user = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') as string)
        : null
      const token = localStorage.getItem('token')

      const { setChannels, setActiveChannel } = useChannelStore()
      const { addUserIfNotExists } = useUsersStore()

      const channelsRes = await api.get('/channel/me')
      const channels = channelsRes.data
      console.log('Channels:', channels)
      const _channelsObj = channels.map(
        (channel: {
          id: number
          name: string
          privacy: string
          ownerId: number
          users: ApiUser[]
          messages: ChannelMessage[]
        }) => ({
          id: channel.id,
          name: channel.name,
          privacy: channel.privacy,
          slug: '',
          members: channel.users.map((user: ApiUser) => ({
            userId: user.id,
            role:
              user.id === channel.ownerId
                ? ChannelRole.ADMIN
                : ChannelRole.MEMBER,
            joinedAt: '',
            kickCount: 0,
          })),
          messages: channel.messages || [],
        }),
      )

      const uniqueUsers: User[] = []
      const uniqueUserIds: number[] = []

      channels.forEach(
        (channel: {
          id: number
          name: string
          privacy: string
          ownerId: number
          users: ApiUser[]
          messages: ChannelMessage[]
        }) => {
          channel.users.forEach((user: ApiUser) => {
            if (!uniqueUserIds.includes(user.id)) {
              uniqueUsers.push({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                nickName: user.nickName,
                email: user.email,
                status: UserStatus.OFFLINE,
                profilePicture: user.profilePicture,
              })
              uniqueUserIds.push(user.id)
            }
          })
        },
      )
      console.log('Unique users:', uniqueUsers)
      uniqueUsers.forEach((user: User) => {
        addUserIfNotExists(user)
      })

      setChannels(_channelsObj)
      setActiveChannel(_channelsObj[0])

      if (user && token) {
        this.user = user
        this.token = token

        // attachDefaultEventListener(this.user!.id)
        bindEventListener(this.user!.id)

        _channelsObj.forEach((channel: typeof _channelsObj) => {
          bindChannelMessageListener(channel.id)
        })

        return true
      }
      return false
    },
  },
})
