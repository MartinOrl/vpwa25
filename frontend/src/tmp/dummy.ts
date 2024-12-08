import { ChannelData, ChannelPrivacy, ChannelRole } from '@/utils/types/channel'
import { User, UserStatus } from '@/utils/types/user'

const usersTest: User[] = [
  {
    id: 1,
    email: 'asd@gmail.com',
    firstName: 'Joe',
    lastName: 'Mama',
    nickName: 'Joe',
    status: UserStatus.ONLINE,
    profilePicture: 'https://randomuser.me/api/portraits/thumb/men/18.jpg',
  },
  {
    id: 2,
    email: 'asd@asdd.com',
    firstName: 'John',
    lastName: 'Doe',
    nickName: 'John',
    status: UserStatus.ONLINE,
    profilePicture: 'https://randomuser.me/api/portraits/thumb/men/19.jpg',
  },
  {
    id: 3,
    email: 'jane.doe@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    nickName: 'Jane',
    status: UserStatus.OFFLINE,
    profilePicture: 'https://randomuser.me/api/portraits/thumb/women/20.jpg',
  },
  {
    id: 4,
    email: 'bob.smith@example.com',
    firstName: 'Bob',
    lastName: 'Smith',
    nickName: 'Bob',
    status: UserStatus.ONLINE,
    profilePicture: 'https://randomuser.me/api/portraits/thumb/men/21.jpg',
  },
  {
    id: 5,
    email: 'alice.jones@example.com',
    firstName: 'Alice',
    lastName: 'Jones',
    nickName: 'Alice',
    status: UserStatus.DO_NOT_DISTURB,
    profilePicture: 'https://randomuser.me/api/portraits/thumb/women/22.jpg',
  },
  {
    id: 6,
    email: 'charlie.brown@example.com',
    firstName: 'Charlie',
    lastName: 'Brown',
    nickName: 'Charlie',
    status: UserStatus.ONLINE,
    profilePicture: 'https://randomuser.me/api/portraits/thumb/men/23.jpg',
  },
  {
    id: 7,
    email: 'david.wilson@example.com',
    firstName: 'David',
    lastName: 'Wilson',
    nickName: 'David',
    status: UserStatus.OFFLINE,
    profilePicture: 'https://randomuser.me/api/portraits/thumb/men/24.jpg',
  },
]

const channelsTest: ChannelData[] = [
  {
    id: 1,
    name: 'General',
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
        messageId: 1,
        content: 'Hello, World!',
        timestamp: '2024-11-07T02:15:28',
        senderId: 1,
        channelId: 1,
      },
      {
        messageId: 2,
        content: 'Hello, World!',
        timestamp: '2024-11-09T02:15:35',
        senderId: 3,
        channelId: 1,
      },
      {
        messageId: 3,
        content: 'Hello, World!',
        timestamp: '2024-11-09T03:40:00',
        senderId: 4,
        channelId: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Private',
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
        messageId: 4,
        content: 'Hello, World!',
        timestamp: '2024-11-09T02:15:28',
        senderId: 1,
        channelId: 2,
      },
      {
        messageId: 5,
        content: 'Hello, World!',
        timestamp: '2024-11-09T02:15:35',
        senderId: 5,
        channelId: 2,
      },
    ],
  },
  {
    id: 3,
    name: 'Secret',
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
        messageId: 6,
        content: 'Hello, World!',
        timestamp: '2024-11-09T03:08:27',
        senderId: 3,
        channelId: 3,
      },
      {
        messageId: 7,
        content: 'Hello, World!',
        timestamp: '2024-11-09T03:25:56',
        senderId: 1,
        channelId: 3,
      },
      {
        messageId: 8,
        content: 'Hello, World!',
        timestamp: '2024-11-09T03:46:00',
        senderId: 4,
        channelId: 3,
      },
    ],
  },
]

export { channelsTest, usersTest }
