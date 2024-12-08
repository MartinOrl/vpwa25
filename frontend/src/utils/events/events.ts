import { ServerEvent } from '../types/misc'
import { ChannelInviteEvent } from './invite'
import { ChannelJoinedEvent } from './joined'
import { ChannelLeaveEvent } from './leave'

const handlers = [ChannelJoinedEvent, ChannelLeaveEvent, ChannelInviteEvent]

export default function processUserEvent(event: ServerEvent) {
  const handler = handlers.find((h) => h.signature === event.event)
  if (handler) {
    handler.handler(event)
  } else {
    console.warn('No handler found for event:', event.event)
  }
}
