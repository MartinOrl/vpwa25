enum ChannelPrivacy {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

enum ChannelRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  KICKED = 'KICKED',
}

type ChannelMessage = {
  messageId: number
  content: string
  timestamp: string
  senderId: number
  channelId: number
}

type Notification = {
  id: number
  message: string
  timestamp: string
}

type ChannelMetadata = {
  channelId: number
  notifications: Notification[]
  isInvitation: boolean
}

type ChannelInfo = {
  id: number
  name: string
  privacy: ChannelPrivacy
  members: ChannelMember[]
}

type ChannelMember = {
  userId: number
  role: ChannelRole
  joinedAt: string
  kickCount: number
}

type Channel = ChannelInfo & {
  description: string
  members: number
}

type ChannelData = ChannelInfo & {
  messages: ChannelMessage[]
}

type ApiUser = {
  id: number
  firstName: string
  lastName: string
  nickName: string
  email: string
  profilePicture: string
  status: string
}

export {
  ChannelPrivacy,
  Channel,
  ChannelInfo,
  ChannelRole,
  ChannelData,
  ChannelMessage,
  ChannelMetadata,
  ChannelMember,
  ApiUser,
}
