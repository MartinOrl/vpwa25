import { ChannelData, ChannelPrivacy, ChannelRole } from '@/utils/types/channel'
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

const channelsTest: ChannelData[] = [
  {
    id: 1,
    name: 'General',
    slug: 'general',
    privacy: ChannelPrivacy.PUBLIC,
    members: [
      {
        userId: 1,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
        kickCount: 0,
      },
      {
        userId: 3,
        role: ChannelRole.ADMIN,
        joinedAt: '2024-10-19T12:00:00',
        kickCount: 0,
      },
      {
        userId: 4,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
        kickCount: 0,
      },
    ],
    messages: [
      {
        messageID: 1,
        content: 'Hello, World!',
        timestamp: '2024-11-07T02:15:28',
        senderID: 1,
        channelID: 1,
      },
      {
        messageID: 2,
        content: 'Hello, World!',
        timestamp: '2024-11-09T02:15:35',
        senderID: 3,
        channelID: 1,
      },
      {
        messageID: 3,
        content: 'Hello, World!',
        timestamp: '2024-11-09T03:40:00',
        senderID: 4,
        channelID: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Private',
    slug: 'private',
    privacy: ChannelPrivacy.PRIVATE,
    members: [
      {
        userId: 1,
        role: ChannelRole.ADMIN,
        joinedAt: '2024-10-08T12:00:00',
        kickCount: 0,
      },
      {
        userId: 5,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-08T12:00:00',
        kickCount: 0,
      },
    ],
    messages: [
      {
        messageID: 4,
        content: 'Hello, World!',
        timestamp: '2024-11-09T02:15:28',
        senderID: 1,
        channelID: 2,
      },
      {
        messageID: 5,
        content: 'Hello, World!',
        timestamp: '2024-11-09T02:15:35',
        senderID: 5,
        channelID: 2,
      },
    ],
  },
  {
    id: 3,
    name: 'Secret',
    slug: 'secret',
    privacy: ChannelPrivacy.PUBLIC,
    members: [
      {
        userId: 3,
        role: ChannelRole.ADMIN,
        joinedAt: '2024-11',
        kickCount: 0,
      },
      {
        userId: 1,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
        kickCount: 0,
      },
      {
        userId: 4,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
        kickCount: 0,
      },
      {
        userId: 5,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
        kickCount: 0,
      },
      {
        userId: 6,
        role: ChannelRole.MEMBER,
        joinedAt: '2024-10-19T12:00:00',
        kickCount: 0,
      },
    ],
    messages: [
      {
        messageID: 6,
        content: 'Hello, World!',
        timestamp: '2024-11-09T03:08:27',
        senderID: 3,
        channelID: 3,
      },
      {
        messageID: 7,
        content: 'Hello, World!',
        timestamp: '2024-11-09T03:25:56',
        senderID: 1,
        channelID: 3,
      },
      {
        messageID: 8,
        content: 'Hello, World!',
        timestamp: '2024-11-09T03:46:00',
        senderID: 4,
        channelID: 3,
      },
    ],
  },
]

export { channelsTest, usersTest }
