import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Message from '#models/message'

export default class ChannelsController {
  //DELETE a channel
  public async destroy({ request, auth, response }: HttpContext) {
    const { name } = request.params()

    // Find the channel by name and privacy
    const channel = await Channel.query().whereRaw('LOWER(name) = ?', name.toLowerCase()).first()

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
    let { name, privacy } = request.only(['name', 'privacy'])

    privacy = privacy.toUpperCase()

    if (privacy.toLowerCase() !== 'public' && privacy.toLowerCase() !== 'private') {
      return response.badRequest({ message: 'Invalid privacy type' })
    }

    const channel = await Channel.query()
      .whereRaw('LOWER(name) = ?', name.toLowerCase())
      .andWhere('privacy', privacy)
      .first()

    if (!channel) {
      const ownerId = auth.user!.id
      const newChannel = await Channel.create({ name, privacy, ownerId })
      await newChannel.related('users').attach([ownerId])

      await Message.create({
        channelID: newChannel.id,
        senderID: 0,
        content: `${auth.user!.nickName} has created this channel`,
      })

      return response.created({
        message: 'Channel created and joined successfully',
        channel: newChannel,
      })
    }

    // Add the authenticated user to the channel
    if (channel.privacy === 'PUBLIC') {
      const isUserInChannel = await channel
        .related('users')
        .query()
        .where('user_id', auth.user!.id)
        .first()
      if (isUserInChannel) {
        return response.badRequest({ message: 'You are already in this channel' })
      }

      await channel.related('users').attach([auth.user!.id])
    } else {
      return response.forbidden({ message: 'You can only join public channels' })
    }

    await Message.create({
      channelID: channel.id,
      senderID: 0,
      content: `${auth.user!.nickName} has joined the channel`,
    })

    return response.ok({ message: 'Joined the channel successfully', channel })
  }

  // Leave a channel
  public async leave({ request, auth, response }: HttpContext) {
    const { name } = request.params()

    // Find the channel by name
    const channel = await Channel.query().whereRaw('LOWER(name) = ?', name.toLowerCase()).first()

    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    // Check if the authenticated user is the owner of the channel
    if (channel.ownerId === auth.user!.id) {
      await channel.delete()
      return response.ok({ message: 'Channel deleted successfully' })
    }

    // Remove the authenticated user from the channel
    await channel.related('users').detach([auth.user!.id])

    await Message.create({
      channelID: channel.id,
      senderID: 0,
      content: `${auth.user!.nickName} has left the channel`,
    })

    return response.ok({ message: 'You have successfully left the channel' })
  }

  // List all channels
  public async listUserChannels({ auth, request, response }: HttpContext) {
    // Get the authenticated user
    const token = request.header('Authorization')
    console.log(token)
    //! REMOVE
    const user = await auth.use('api').authenticate()

    console.log(user)
    try {
      const channels = await user.related('channels').query().select('id', 'name', 'privacy')

      return response.ok(channels)
    } catch (error) {
      console.error(error)
      return response.badRequest({ message: 'Failed to list channels', error })
    }
  }

  public async getPaginatedMessages({ request, auth, response }: HttpContext) {
    const { name } = request.params()
    const { page, limit } = (request.qs() as { page: number; limit: number }) || {
      page: 1,
      limit: 10,
    }

    const channel = await Channel.query().whereRaw('LOWER(name) = ?', name.toLowerCase()).first()

    // check if user is member
    const isUserMember = await Channel.query()
      .whereRaw('LOWER(name) = ?', name.toLowerCase())
      .andWhereHas('users', (query) => {
        query.where('user_id', auth.user!.id)
      })
      .first()

    if (!isUserMember) {
      return response.forbidden({ message: 'You are not a member of this channel' })
    }

    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    console.log(await channel.related('messages').query().select('id', 'content'))

    const messages = await channel
      .related('messages')
      .query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.ok(messages)
  }

  // List all users in a channel
  public async listUsersInChannel({ request, auth, response }: HttpContext) {
    const { name } = request.params()

    const isUserMember = await Channel.query()
      .whereRaw('LOWER(name) = ?', name.toLowerCase())
      .andWhereHas('users', (query) => {
        query.where('user_id', auth.user!.id)
      })
      .first()

    if (!isUserMember) {
      return response.forbidden({ message: 'You are not a member of this channel' })
    }

    // Find the channel by name
    const channel = await Channel.query()
      .whereRaw('LOWER(name) = ?', name.toLowerCase())
      .preload('users', (query) => {
        query.select('id', 'email', 'firstName', 'lastName', 'nickName', 'status', 'profilePicture')
      })
      .first()

    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    const usersWithRoles = channel.users.map((user) => {
      console.log(user.$extras)
      return {
        ...user.serialize(),
        role: user.$extras.pivot_role, // Access the 'role' from the pivot table
      }
    })
    // Return the list of users
    return response.ok(usersWithRoles)
  }
}
