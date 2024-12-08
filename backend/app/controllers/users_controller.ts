// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import transmit from '@adonisjs/transmit/services/main'

const sanitizeStatus = (status: string) => {
  if (status === 'Online') return 'ONLINE'
  if (status === 'Offline') return 'OFFLINE'
  if (status === 'Do not disturb') return 'DO_NOT_DISTURB'
  return
}
export default class UsersController {
  public async updateStatus({ request, auth, response }: HttpContext) {
    const { status } = request.body()

    const authUser = auth.user!

    const updated = await User.query()
      .where('id', authUser.id)
      .update({
        status: sanitizeStatus(status),
      })

    const userChannels = await authUser.related('channels').query()
    userChannels.forEach((channel) => {
      transmit.broadcast(
        `chat/${channel.id}`,
        JSON.stringify({
          event: 'status:update',
          data: {
            userId: authUser.id,
            status: sanitizeStatus(status),
          },
        })
      )
    })

    return response.ok({ message: 'Status updated successfully' })
  }

  public async reload({ auth, response }: HttpContext) {
    const authUser = auth.user!

    const user = await User.query().where('id', authUser.id).firstOrFail()
    const token = await auth.use('api').authenticateAsClient(user)

    return response.ok({ user, token })
  }
}
