import { HttpContext } from '@adonisjs/core/http'
import KickVote from '#models/kick_vote'
import db from '@adonisjs/lucid/services/db'

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

    // Add the vote
    await KickVote.create({ userId, channelId, votedBy: voterId })

    // Count votes for the user in the channel
    const voteCount = await KickVote.query()
      .where('user_id', userId)
      .andWhere('channel_id', channelId)
      .count('* as total')

    if (voteCount[0].toJSON()['total'] >= this.voteThreshold) {
      // Update the user's status in the channel
      await db
        .from('channel_users')
        .where('user_id', userId)
        .andWhere('channel_id', channelId)
        .update({ status: 'KICKED' })

      // Optionally: Delete votes for the kicked user (clean up)
      await KickVote.query().where('user_id', userId).andWhere('channel_id', channelId).delete()

      return response.ok({ message: 'User has been kicked from the channel' })
    }

    return response.ok({ message: 'Vote registered successfully' })
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

    return response.ok({ message: 'User status has been revoked to MEMBER' })
  }
}
