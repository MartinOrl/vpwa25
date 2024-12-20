import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class LoginController {
public async login(ctx: HttpContext) {
    const { request, auth, response } = ctx
    const { email, password } = request.only(['email', 'password'])

    try {
        // Find the user by email
        const user = await User.findBy('email', email)
        if (!user) {
        return response.unauthorized({ message: 'Invalid credentials' })
        }

        // Verify password
        const passwordVerified = await hash.verify(user.password, password)
        if (!passwordVerified) {
        return response.unauthorized({ message: 'Invalid credentials' })
        }


        const token = await auth.use('api').authenticateAsClient(user)  
        return response.ok({ token })
    } catch (error) {
        console.error(error)
        return response.badRequest({ message: 'Login failed', error })
    }
}}