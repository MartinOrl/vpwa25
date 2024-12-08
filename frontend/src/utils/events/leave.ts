import {
  unbindChannelMessageListener,
  useChannelStore,
} from '@/stores/channelStore'

import { ServerEvent, ServerEventHandler } from '../types/misc'

export const ChannelLeaveEvent: ServerEventHandler = {
  signature: 'channel:leave',
  handler: (event: ServerEvent) => {
    const channelId = event.data as number
    const { removeChannel } = useChannelStore()

    console.log('Removing channel:', channelId)
    removeChannel(channelId as number)
    unbindChannelMessageListener(channelId)
  },
}
