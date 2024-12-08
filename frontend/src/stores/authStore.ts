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

export const sanitizeStatus = (status: string): UserStatus => {
  if (status?.includes('_') || status.match('Do not disturb')) {
    return 'Do not disturb' as UserStatus
  } else if (status?.toLowerCase() === 'offline') {
    return 'Offline' as UserStatus
  } else return 'Online' as UserStatus
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    notificationsType: 'default' as 'default' | 'mention',
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
      this.user = {
        ...user,
        status: sanitizeStatus(user.status),
      }
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      bindEventListener(user.id)
    },
    setNotificationsType(type: 'default' | 'mention') {
      this.notificationsType = type
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
    async updateStatus(status: UserStatus) {
      if (this.user) {
        this.user.status = status
        localStorage.setItem('user', JSON.stringify(this.user))
      }

      await api.post('/user/status', {
        status,
      })
    },
    isOffline() {
      if (this.user) {
        return this.user.status === UserStatus.OFFLINE
      }
      return true
    },
    async reload() {
      const _res = await api.get('/user/reload')
      const userRef = _res.data.user
      const token = _res.data.token.headers.authorization

      this.login(userRef, token)
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
                status: sanitizeStatus(UserStatus.OFFLINE),
                profilePicture: user?.profilePicture,
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
      console.log('Active channel:', _channelsObj[0])
      if (user && token) {
        const _res = await api.get('/user/reload')
        const userRef = _res.data.user
        const token = _res.data.token.headers.authorization

        this.login(userRef, token)

        _channelsObj.forEach((channel: typeof _channelsObj) => {
          bindChannelMessageListener(channel.id)
        })

        return true
      }
      return false
    },
  },
})
