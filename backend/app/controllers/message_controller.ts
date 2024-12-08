import Message from '#models/message'
import type { HttpContext } from '@adonisjs/core/http'
import transmit from '@adonisjs/transmit/services/main'
import { DateTime } from 'luxon'

export default class MessageController {
  public async sendMessage({ request, response, auth }: HttpContext) {
    const messageData = request.only(['content', 'channelID'])
    const senderID = auth.user!.id
    const timestamp = new Date().toISOString()

    const newMessage = await Message.create({
      content: messageData.content,
      channelID: messageData.channelID,
      senderID,
      timestamp: DateTime.fromISO(timestamp),
    })

    console.log('Broadcasting message to channel:', messageData.channelID, newMessage.toJSON())
    transmit.broadcast(
      `chat/${messageData.channelID}`,
      JSON.stringify({
        event: 'message:new',
        data: newMessage.toJSON(),
      })
    )

    transmit.broadcast(
      `channel/${messageData.channelID}/typing`,
      JSON.stringify({
        message: '',
        name: '',
      })
    )

    return response.ok({ message: 'Message sent successfully' })
  }
}
