import { HttpContext } from '@adonisjs/core/http'
import KickVote from '#models/kick_vote'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Message from '#models/message'

export default class KickController {
  private readonly voteThreshold = 3

  public async voteKick({ request, auth, response }: HttpContext) {
    const { userId, channelId } = request.only(['userId', 'channelId'])
    const voterId = auth.user!.id

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
    const channel = await db.from('channels').where('id', channelId).first()
    const user = await User.query().where('id', userId).first()
    if (channel.owner_id === voterId) {
      await KickVote.create({ userId, channelId, votedBy: voterId })
      await db
        .from('channel_users')
        .where('user_id', userId)
        .andWhere('channel_id', channelId)
        .delete()
      await KickVote.query().where('user_id', userId).andWhere('channel_id', channelId).delete()
      return response.ok({ message: 'User has been kicked from the channel' })
    }

    const voteCount = await db
      .from('kick_votes')
      .where('user_id', userId)
      .andWhere('channel_id', channelId)
      .count('* as total')
      .first()
    if (!voteCount.total || voteCount.total < this.voteThreshold || voteCount.total === undefined) {
      await KickVote.create({ userId, channelId, votedBy: voterId })
      await Message.create({
        channelID: channelId,
        senderID: 0,
        content: `${user!.nickName} has received a kick vote (${voteCount.total + 1} out of ${this.voteThreshold} votes)`,
      })
      return response.ok({ message: 'Vote registered successfully' })
    }

    if (voteCount.total >= this.voteThreshold - 1) {
      await db
        .query()
        .from('channel_users')
        .where('user_id', userId)
        .andWhere('channel_id', channelId)
        .delete()

      // Optionally: Delete votes for the kicked user (clean up)
      await KickVote.query().where('user_id', userId).andWhere('channel_id', channelId).delete()
      await Message.create({
        channelID: channelId,
        senderID: 0,
        content: `${user!.nickName} has been kicked from the channel`,
      })

      return response.ok({ message: 'User has been kicked from the channel' })
    }
  }

  public async revoke({ request, auth, response }: HttpContext) {
    const { userId, channelId } = request.only(['userId', 'channelId'])
    // Check if the authenticated user has permission to revoke (e.g., is the channel admin)
    const isAdmin = await db
      .from('channels')
      .where('id', channelId)
      .andWhere('owner_id', auth.user!.id)
      .first()
    if (!isAdmin) {
      return response.unauthorized({ message: 'You are not authorized to revoke this user' })
    }
    // Update the user's status in the channel
    const updated = await db
      .from('channel_users')
      .where('user_id', userId)
      .andWhere('channel_id', channelId)
      .update({ status: 'MEMBER' })
    if (updated.length === 0) {
      return response.notFound({ message: 'User or channel not found' })
    }
    await KickVote.query().where('user_id', userId).andWhere('channel_id', channelId).delete()
    return response.ok({ message: 'User status has been revoked to MEMBER' })
  }
}
