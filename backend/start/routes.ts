/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'


router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth routes
router.group(() => {
  router.post('/register', async(ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().register(ctx)

  })
  router.post('/login', async (ctx) => {
    const { default: AuthController } = await import('#controllers/login_controller')
    return new AuthController().login(ctx)
  })
  // You can add other routes here, like login or logout
}).prefix('/api') // 


