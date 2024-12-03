/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.ts'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth routes
router
  .group(() => {
    router
      .group(() => {
        router.post('/register', async (ctx) => {
          const { default: AuthController } = await import('#controllers/auth_controller')
          return new AuthController().register(ctx)
        })
        router.post('/login', async (ctx) => {
          const { default: AuthController } = await import('#controllers/auth_controller')
          return new AuthController().login(ctx)
        })
      })
      .prefix('/auth')
    router
      .group(() => {
        router.get('/me', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          return new ChannelController().listUserChannels(ctx)
        })
        router.get('/:name/users', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          return new ChannelController().listUsersInChannel(ctx)
        })
        router.delete('/:name', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          return new ChannelController().destroy(ctx)
        })
        router.post('/join', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          return new ChannelController().join(ctx)
        })
        router.post('/:name/leave', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          return new ChannelController().leave(ctx)
        })
        router.post('/kick', async (ctx) => {
          const { default: KickController } = await import('#controllers/kick_controller')
          return new KickController().voteKick(ctx)
        })
        router.post('/revoke', async (ctx) => {
          const { default: KickController } = await import('#controllers/kick_controller')
          return new KickController().revoke(ctx)
        })
        router.get('/:name/messages', async (ctx) => {
          const { default: MessageController } = await import('#controllers/channels_controller')
          return new MessageController().getPaginatedMessages(ctx)
        })
      })
      .prefix('/channel')
      .use(middleware.auth())
  })
  .prefix('/api')
