enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DO_NOT_DISTURB = 'DO_NOT_DISTURB',
}

type User = {
  name: string
  surname: string
  nickName: string
  email: string
  status: UserStatus
}

export {UserStatus, User}
