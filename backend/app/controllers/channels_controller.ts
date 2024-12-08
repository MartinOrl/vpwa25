import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'

export default class ChannelsController {
  //DELETE a channel
  public async destroy({ request, auth, response }: HttpContext) {
    const { name } = request.only(['name'])

    // Find the channel by name and privacy
    const channel = await Channel.query().where('name', name).first()

    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    // Check if the authenticated user is the admin (owner of the channel)
    if (channel.ownerId !== auth.user!.id) {
      return response.unauthorized({ message: 'You are not authorized to delete this channel' })
    }

    // Delete the channel
    await channel.delete()

    return response.ok({ message: 'Channel deleted successfully' })
  }

  // Join a channel
  public async join({ auth, response, request }: HttpContext) {
    const { name, type } = request.only(['name', 'type'])
    const channel = await Channel.query().where('name', name).andWhere('type', type).first()

    if (!channel) {
      const ownerId = auth.user!.id
      const newChannel = await Channel.create({ name, type, ownerId })
      await newChannel.related('users').attach([ownerId])
      return response.created({
        message: 'Channel created and joined successfully',
        channel: newChannel,
      })
    }

    // Add the authenticated user to the channel
    if (channel.type === 'PUBLIC') {
      await channel.related('users').attach([auth.user!.id])
    } else {
      return response.forbidden({ message: 'You can only join public channels' })
    }

    return response.ok({ message: 'Joined the channel successfully', channel })
  }

  // Leave a channel
  public async leave({ request, auth, response }: HttpContext) {
    const { name } = request.only(['name'])

    // Find the channel by name
    const channel = await Channel.query().where('name', name).first()

    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    // Remove the authenticated user from the channel
    await channel.related('users').detach([auth.user!.id])

    return response.ok({ message: 'You have successfully left the channel' })
  }

  // List all channels
  public async listUserChannels({ auth, response }: HttpContext) {
    // Get the authenticated user
    const user = auth.user!

    // Fetch channels the user is part of
    const channels = await user
      .related('channels')
      .query()
      .select('id', 'name', 'privacy', 'created_at', 'updated_at')

    return response.ok(channels)
  }

  // List all users in a channel
  public async listUsersInChannel({ request, response }: HttpContext) {
    const { name } = request.only(['name'])

    // Find the channel by name
    const channel = await Channel.query()
      .where('name', name)
      .preload('users', (query) => {
        query.select('id', 'email', 'firstName', 'lastName', 'nickName', 'status', 'profilePicture')
      })
      .first()

    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    // Return the list of users
    return response.ok(channel.users)
  }
}
