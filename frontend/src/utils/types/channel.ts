enum ChannelPrivacy {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

enum ChannelRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  KICKED = 'KICKED',
}

type ChannelInfo = {
  name: string
  privacy: ChannelPrivacy
  slug: string
  admin: string
  members: ChannelMember[]
}

type ChannelMember = {
  userId: number
  role: ChannelRole
  joinedAt: string
}

type Channel = ChannelInfo & {
  description: string
  members: number
}

export { ChannelPrivacy, Channel, ChannelInfo, ChannelRole }
