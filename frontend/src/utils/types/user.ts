enum UserStatus {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  DO_NOT_DISTURB = 'Do not disturb',
}

type User = {
  id: number
  name: string
  surname: string
  nickName: string
  email: string
  status: UserStatus
  image: string
}

export { UserStatus, User }
