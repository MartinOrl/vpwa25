import { ChannelInfo, ChannelPrivacy, ChannelRole } from '@/utils/types/channel'
import { User, UserStatus } from '@/utils/types/user'

const usersTest: User[] = [
  {
    id: 1,
    email: 'asd@gmail.com',
    name: 'Joe',
    nickName: 'Joe',
    surname: 'Mama',
    status: UserStatus.ONLINE,
    image: 'https://randomuser.me/api/portraits/thumb/men/18.jpg',
  },
  {
    id: 2,
    email: 'asd@asdd.com',
    name: 'John',
    nickName: 'John',
    surname: 'Doe',
    status: UserStatus.ONLINE,
    image: 'https://randomuser.me/api/portraits/thumb/men/19.jpg',
  },
  {
    id: 3,
    email: 'jane.doe@example.com',
    name: 'Jane',
    nickName: 'Jane',
    surname: 'Doe',
    status: UserStatus.OFFLINE,
    image: 'https://randomuser.me/api/portraits/thumb/women/20.jpg',
  },
  {
    id: 4,
    email: 'bob.smith@example.com',
    name: 'Bob',
    nickName: 'Bob',
    surname: 'Smith',
    status: UserStatus.ONLINE,
    image: 'https://randomuser.me/api/portraits/thumb/men/21.jpg',
  },
  {
    id: 5,
    email: 'alice.jones@example.com',
    name: 'Alice',
    nickName: 'Alice',
    surname: 'Jones',
    status: UserStatus.DO_NOT_DISTURB,
    image: 'https://randomuser.me/api/portraits/thumb/women/22.jpg',
  },
  {
    id: 6,
    email: 'charlie.brown@example.com',
    name: 'Charlie',
    nickName: 'Charlie',
    surname: 'Brown',
    status: UserStatus.ONLINE,
    image: 'https://randomuser.me/api/portraits/thumb/men/23.jpg',
  },
  {
    id: 7,
    email: 'david.wilson@example.com',
    name: 'David',
    nickName: 'David',
    surname: 'Wilson',
    status: UserStatus.OFFLINE,
    image: 'https://randomuser.me/api/portraits/thumb/men/24.jpg',
  },
]

const channelsTest: ChannelInfo[] = [
  {
    name: 'General',
    admin: 'admin',
    slug: 'general',
    privacy: ChannelPrivacy.PUBLIC,
    members: [
      {
        userId: 1,
        role: ChannelRole.ADMIN,
        joinedAt: '2024-10-19T12:00:00',
      },
      {
        userId: 3,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
      },
      {
        userId: 4,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
      },
    ],
  },
  {
    name: 'Private',
    admin: 'admin',
    slug: 'private',
    privacy: ChannelPrivacy.PRIVATE,
    members: [
      {
        userId: 1,
        role: ChannelRole.ADMIN,
        joinedAt: '2024-10-19T12:00:00',
      },
      {
        userId: 5,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
      },
    ],
  },
  {
    name: 'Secret',
    admin: 'admin',
    slug: 'secret',
    privacy: ChannelPrivacy.PUBLIC,
    members: [
      {
        userId: 3,
        role: ChannelRole.ADMIN,
        joinedAt: '2024-10-19T12:00:00',
      },
      {
        userId: 1,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
      },
      {
        userId: 4,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
      },
      {
        userId: 5,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
      },
      {
        userId: 6,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
      },
    ],
  },
]

export { channelsTest, usersTest }
