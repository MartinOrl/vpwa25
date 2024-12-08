enum UserStatus {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  DO_NOT_DISTURB = 'Do not disturb',
}

type User = {
  id: number
  firstName: string
  lastName: string
  nickName: string
  email: string
  status: UserStatus
  profilePicture: string
}

export { UserStatus, User }
