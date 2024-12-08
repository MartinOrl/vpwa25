import { defineStore } from 'pinia'
import { UserStatus, type User } from '@/utils/types/user'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
  }),

  actions: {
    setUsers(users: User[]) {
      this.users = users
    },
    addUserIfNotExists(user: User) {
      if (!this.users.find((u) => u.id === user.id)) {
        this.users.push(user)
      }
    },
    clearUser(user: User) {
      this.users = this.users.filter((u) => u.id !== user.id)
    },
    findUserById(id: number) {
      return this.users.find((u) => u.id === id)
    },
    findUserByNickname(nickname: string) {
      return this.users.find((u) => u.nickName === nickname)
    },
    updateUserStatus(id: number, status: UserStatus) {
      const user = this.users.find((u) => u.id === id)
      if (user) {
        user.status = status
      }
    },
    updateUser(user: User) {
      const index = this.users.findIndex((u) => u.id === user.id)
      if (index !== -1) {
        this.users[index] = user
      }
    },
  },
})
