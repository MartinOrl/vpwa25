import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Message from '#models/message'
import transmit from '@adonisjs/transmit/services/main'
import User from '#models/user'

const notifyChannel = (channelId: number, message: any) => {
  transmit.broadcast(
    `chat/${channelId}`,
    JSON.stringify({
      event: 'message:new',
      data: message,
    })
  )
}

const cancelTyping = (channelId: number) => {
  transmit.broadcast(
    `channel/${channelId}/typing`,
    JSON.stringify({
      message: '',
      name: '',
    })
  )
}

export default class ChannelsController {
  //DELETE a channel
  public async announceTyping({ request, response }: HttpContext) {
    const { channelId } = request.params()
    const { message, name } = request.body()

    transmit.broadcast(`channel/${channelId}/typing`, JSON.stringify({ message, name }))
    return response.ok(null)
  }

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

    const users = await channel.related('users').query().select('id')

    // Delete the channel
    await channel.delete()

    cancelTyping(channel.id)
    users.forEach((user) => {
      transmit.broadcast(
        `events/user/${user.id}`,
        JSON.stringify({
          event: 'channel:leave',
          data: channel.id,
        })
      )
    })

    return response.ok({ message: 'Channel deleted successfully' })
  }

  // Join a channel
  public async join({ auth, response, request }: HttpContext) {
    let { name, privacy } = request.only(['name', 'privacy'])

    privacy = privacy.toUpperCase()

    if (privacy.toLowerCase() !== 'public' && privacy.toLowerCase() !== 'private') {
      return response.badRequest({ message: 'Invalid privacy type' })
    }

    const channel = await Channel.query().whereRaw('LOWER(name) = ?', name.toLowerCase()).first()

    if (!channel) {
      const ownerId = auth.user!.id
      const newChannel = await Channel.create({ name, privacy, ownerId })
      await Message.create({
        channelID: newChannel.id,
        senderID: 0,
        content: `${auth.user!.nickName} has created this channel`,
      })

      const channelObj = await Channel.query()
        .whereRaw('LOWER(name) = ?', name.toLowerCase())
        .preload('users')
        .preload('messages')
        .first()

      console.log('Broadcasting new channel to user', auth.user!.id)
      transmit.broadcast(
        `events/user/${auth.user!.id}`,
        JSON.stringify({
          event: 'channel:joined',
          data: { channel: channelObj },
        })
      )

      cancelTyping(newChannel.id)

      return response.created()
    }
    cancelTyping(channel.id)
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

    const announcement = await Message.create({
      channelID: channel.id,
      senderID: 0,
      content: `${auth.user!.nickName} has joined the channel`,
    })

    const channelObj = await Channel.query()
      .whereRaw('LOWER(name) = ?', name.toLowerCase())
      .preload('users')
      .preload('messages')
      .first()

    transmit.broadcast(
      `events/user/${auth.user!.id}`,
      JSON.stringify({
        event: 'channel:joined',
        data: { channel: channelObj },
      })
    )

    notifyChannel(channel.id, announcement.serialize())
    cancelTyping(channel.id)

    return response.ok(null)
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
      const channelUsers = await channel.related('users').query().select('id')

      await channel.delete()

      transmit.broadcast(
        `events/user/${auth.user!.id}`,
        JSON.stringify({
          event: 'channel:leave',
          data: channel.id,
        })
      )

      channelUsers.forEach((user) => {
        transmit.broadcast(
          `events/user/${user.id}`,
          JSON.stringify({
            event: 'channel:leave',
            data: channel.id,
          })
        )
      })

      cancelTyping(channel.id)

      return response.ok({ message: 'Channel deleted successfully' })
    }

    // Remove the authenticated user from the channel
    await channel.related('users').detach([auth.user!.id])

    const announcement = await Message.create({
      channelID: channel.id,
      senderID: 0,
      content: `${auth.user!.nickName} has left the channel`,
    })
    console.log('Broadcasting to user', auth.user!.id)

    transmit.broadcast(
      `events/user/${auth.user!.id}`,
      JSON.stringify({
        event: 'channel:leave',
        data: channel.id,
      })
    )

    notifyChannel(channel.id, announcement.serialize())
    cancelTyping(channel.id)

    return response.ok({ message: 'You have successfully left the channel' })
  }

  // List all channels
  public async listUserChannels({ auth, request, response }: HttpContext) {
    // Get the authenticated user
    const token = request.header('Authorization')
    //! REMOVE
    const user = await auth.use('api').authenticate()

    try {
      const channels = await user
        .related('channels')
        .query()
        .select('id', 'name', 'ownerId', 'privacy')
        .preload('users')

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

    const messages = await channel
      .related('messages')
      .query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.ok(messages)
  }

  public async getChannel({ request, response }: HttpContext) {
    const { name } = request.params()

    const channel = await Channel.query()
      .whereRaw('LOWER(name) = ?', name.toLowerCase())

      .first()

    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    const channelData = await Channel.query()
      .whereRaw('LOWER(name) = ?', name.toLowerCase())
      .preload('messages')
      .preload('users')
      .first()

    return response.ok({ channel: channelData })
  }

  public async invite({ request, auth, response }: HttpContext) {
    const { name: channelName } = request.params()
    const { nickName } = request.body()

    const channel = await Channel.query()
      .whereRaw('LOWER(name) = ?', channelName.toLowerCase())
      .first()

    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    if (channel.privacy === 'PRIVATE' && channel.ownerId !== auth.user!.id) {
      return response.forbidden({
        message: 'You are not authorized to invite users to this channel',
      })
    }

    const user = await User.query().whereILike('nickName', nickName).first()

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    const isUserInChannel = await channel.related('users').query().where('user_id', user.id).first()

    if (isUserInChannel) {
      return response.badRequest({ message: 'User is already in this channel' })
    }

    await channel.related('users').attach([user.id])

    const announcement = await Message.create({
      channelID: channel.id,
      senderID: 0,
      content: `${auth.user?.nickName} has invited ${user.nickName} to the channel`,
    })

    const channelObj = await Channel.query()
      .whereRaw('LOWER(name) = ?', channelName.toLowerCase())
      .preload('users')
      .preload('messages')
      .first()

    transmit.broadcast(
      `events/user/${user.id}`,
      JSON.stringify({
        event: 'channel:invite',
        data: { channel: channelObj },
      })
    )

    notifyChannel(channel.id, announcement.serialize())
    cancelTyping(channel.id)

    return response.created()
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
      return {
        ...user.serialize(),
        role: user.$extras.pivot_role, // Access the 'role' from the pivot table
      }
    })
    // Return the list of users
    return response.ok(usersWithRoles)
  }
}
