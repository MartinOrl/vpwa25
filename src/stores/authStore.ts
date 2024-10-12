import { defineStore } from 'pinia'
import { User } from '@/utils/types/user'

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
    },
    logout() {
      this.user = null
      this.token = null
    },
    loadUser() {
      if (this.isLoggedIn) {
        return true
      }
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      if (user && token) {
        this.user = JSON.parse(user)
        this.token = token
        return true
      }
      return false
    },
  },
})
