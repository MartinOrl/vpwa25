type Command = {
  command: string
  shadow: string
  args: string[]
  description: string
  example: string
  validate: (...args: any[]) => boolean
  allows: (...args: any[]) => boolean
  run: (...args: any[]) => void
}

type EventType = string

type Event<T> = {
  type: EventType
  data?: T
}

enum Events {
  ListChannelMembers = 'list_channel_members',
}

export { Command, EventType, Event, Events }
