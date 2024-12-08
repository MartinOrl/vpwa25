import { HttpContext } from '@adonisjs/core/http'
import KickVote from '#models/kick_vote'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Message from '#models/message'
import transmit from '@adonisjs/transmit/services/main'
import Channel from '#models/channel'

const notifyChannel = (channelId: number, message: any) => {
  transmit.broadcast(`chat/${channelId}`, message)
}

export default class KickController {
  private readonly voteThreshold = 3

  public async voteKick({ request, auth, response }: HttpContext) {
    const { userName, channelName } = request.only(['userName', 'channelName'])
    const voterId = auth.user!.id

    let u = await User.query().whereRaw('LOWER("nickName") = ?', userName.toLowerCase()).first()
    if (!u) {
      return response.notFound({ message: 'User not found' })
    }

    let c = await Channel.query().where('name', channelName).first()
    if (!c) {
      return response.notFound({ message: 'Channel not found' })
    }

    let userId = u.id
    let channelId = c.id

    // Check if the voter has already voted
    const existingVote = await KickVote.query()
      .where('user_id', userId)
      .andWhere('channel_id', channelId)
      .andWhere('voted_by', voterId)
      .first()

    if (existingVote) {
      return response.badRequest({ message: 'You have already voted to kick this user' })
    }

    if (voterId === userId) {
      return response.badRequest({ message: 'You cannot vote to kick yourself' })
    }
    // check if the voter is owner of the channel
    // const channel = await db.from('channels').where('id', channelId).first()
    const channel = await Channel.query().where('id', channelId).first()

    const user = await User.query().where('id', userId).first()
    if (channel?.ownerId === voterId) {
      await KickVote.create({ userId, channelId, votedBy: voterId })

      channel.related('users').detach([userId])

      await KickVote.query().where('user_id', userId).andWhere('channel_id', channelId).delete()

      const announcement = await Message.create({
        channelID: channelId,
        senderID: 0,
        content: `${user!.nickName} has been kicked from the channel by the owner`,
      })

      transmit.broadcast(
        `events/user/${user!.id}`,
        JSON.stringify({
          event: 'channel:leave',
          data: channel.id,
        })
      )
      notifyChannel(channelId, announcement)

      return response.ok({ message: 'User has been kicked from the channel' })
    }

    const voteCount = await KickVote.query()
      .where('user_id', userId)
      .andWhere('channel_id', channelId)
      .count('* as total')
      .first()

    const count = Number(voteCount?.$extras.total)

    if (!count || count + 1 < this.voteThreshold || count === undefined) {
      await KickVote.create({ userId, channelId, votedBy: voterId })
      const announcement = await Message.create({
        channelID: channelId,
        senderID: 0,
        content: `${user!.nickName} has received a kick vote (${Number(count) + 1} out of ${this.voteThreshold} votes)`,
      })

      notifyChannel(channelId, announcement)

      return response.ok({ message: 'Vote registered successfully' })
    }

    if (count >= this.voteThreshold - 1) {
      channel?.related('users').detach([userId])

      // Optionally: Delete votes for the kicked user (clean up)
      await KickVote.query().where('user_id', userId).andWhere('channel_id', channelId).delete()
      const announcement = await Message.create({
        channelID: channelId,
        senderID: 0,
        content: `${user!.nickName} has been kicked from the channel`,
      })

      if (channel?.ownerId === userId) {
        const users = await channel.related('users').query()
        users.forEach((_u) => {
          transmit.broadcast(
            `events/user/${_u.id}`,
            JSON.stringify({
              event: 'channel:leave',
              data: channelId,
            })
          )
        })

        await channel.delete()
      } else {
        transmit.broadcast(
          `events/user/${user!.id}`,
          JSON.stringify({
            event: 'channel:leave',
            data: channelId,
          })
        )
      }

      notifyChannel(channelId, announcement)

      return response.ok({ message: 'User has been kicked from the channel' })
    }
  }

  public async revoke({ request, auth, response }: HttpContext) {
    const { userName, channelName } = request.only(['userName', 'channelName'])

    let u = await User.query().whereRaw('LOWER("nickName") = ?', userName.toLowerCase()).first()
    if (!u) {
      return response.notFound({ message: 'User not found' })
    }

    let c = await Channel.query().where('name', channelName).first()
    if (!c) {
      return response.notFound({ message: 'Channel not found' })
    }

    let userId = u.id
    let channelId = c.id
    // Check if the authenticated user has permission to revoke (e.g., is the channel admin)

    const channel = await Channel.query()
      .where('id', channelId)
      .andWhere('owner_id', auth.user!.id)
      .first()
    if (!channel) {
      return response.unauthorized({ message: 'You are not authorized to revoke this user' })
    }

    const isInChannel = await channel.related('users').query().where('user_id', userId).first()

    if (isInChannel) {
      return response.badRequest({ message: 'User is not kicked from the channel' })
    }

    channel.related('users').attach([userId])

    await KickVote.query().where('user_id', userId).andWhere('channel_id', channelId).delete()

    const user = await User.query().where('id', userId).select('nickName').first()

    const announcement = await Message.create({
      channelID: channelId,
      senderID: 0,
      content: `${user!.nickName} has been revoked from the kick vote`,
    })

    notifyChannel(channelId, announcement)

    const channelObj = await Channel.query()
      .where('id', channelId)
      .preload('users')
      .preload('messages')
      .first()

    transmit.broadcast(
      `events/user/${userId}`,
      JSON.stringify({
        event: 'channel:invite',
        data: {
          channel: channelObj,
        },
      })
    )

    return response.ok({ message: 'User status has been revoked to MEMBER' })
  }
}
