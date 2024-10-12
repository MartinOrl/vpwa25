enum ChannelPrivacy {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

type Channel = {
  name: string
  description: string
  members: number
  admin: string
  privacy: ChannelPrivacy
}

export {ChannelPrivacy, Channel}
