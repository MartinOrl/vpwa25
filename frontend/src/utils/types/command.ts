import { CommandAllowRule } from './misc'

type Command = {
  command: string
  shadow: string
  args: string[]
  description: string
  example: string
  validate: (...args: any[]) => boolean
  allows: (...args: CommandAllowRule[]) => boolean
  run: (...args: any[]) => void
}

type EventType = string

type Event<T> = {
  type: EventType
  data?: T
}

enum Events {
  ListChannelMembers = 'list_channel_members',
  RequestSendMessage = 'request_send_message',
  SendMessage = 'send_message',
  Typing = 'typing',
  TypingStop = 'typing_stop',
}

export { Command, EventType, Event, Events }
