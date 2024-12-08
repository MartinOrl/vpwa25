import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const userData = request.only(['email', 'firstName', 'lastName', 'nickName', 'password'])
    try {
      const user = await User.create(userData)
      return response.created({ user })
    } catch (error) {
      console.error(error)
      return response.badRequest({ message: 'Unable to register user', error })
    }
  }
}
