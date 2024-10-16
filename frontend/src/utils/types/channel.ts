enum ChannelPrivacy {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

type ChannelInfo = {
  name: string
  privacy: ChannelPrivacy
  slug: string
  admin: string
}

type Channel = ChannelInfo & {
  description: string
  members: number
}

export { ChannelPrivacy, Channel, ChannelInfo }
