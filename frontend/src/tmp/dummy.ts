import { ChannelInfo, ChannelPrivacy } from '@/utils/types/channel'

const channelsTest: ChannelInfo[] = [
  {
    name: 'General',
    admin: 'admin',
    slug: 'general',
    privacy: ChannelPrivacy.PUBLIC,
  },
  {
    name: 'Private',
    admin: 'admin',
    slug: 'private',
    privacy: ChannelPrivacy.PRIVATE,
  },
  {
    name: 'Secret',
    admin: 'admin',
    slug: 'secret',
    privacy: ChannelPrivacy.PUBLIC,
  },
]

export { channelsTest }
