import { defineStore } from 'pinia'
import { channelsTest, usersTest } from '@/tmp/dummy'
import { initiateConnection } from '@/utils/socket'
import { User, UserStatus } from '@/utils/types/user'
import { useChannelStore } from './channelStore'

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
      initiateConnection(1)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      usersTest.push(user)
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    updateStatus(status: UserStatus) {
      if (this.user) {
        this.user.status = status
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },
    loadUser() {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('token')

      const { setChannels, setActiveChannel } = useChannelStore()

      setChannels(channelsTest)
      setActiveChannel(channelsTest[0])

      if (user && token) {
        this.user = JSON.parse(user)
        this.token = token
        return true
      }
      return false
    },
  },
})
