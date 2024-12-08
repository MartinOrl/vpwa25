// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  public async updateStatus({ request, auth, response }: HttpContext) {
    const { status } = request.body()

    const authUser = auth.user!

    const user = await User.findOrFail(authUser.id)
    console.log('User:', user)

    return response.ok({ message: 'Status updated successfully' })
  }
}
