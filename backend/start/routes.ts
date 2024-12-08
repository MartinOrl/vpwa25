/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { middleware } from './kernel.ts'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth routes
transmit.registerRoutes()

router
  .group(() => {
    router
      .group(() => {
        router.post('/register', async (ctx) => {
          const { default: AuthController } = await import('#controllers/auth_controller')
          console.log(`POST /api/auth/register`, new Date().toISOString())
          return new AuthController().register(ctx)
        })
        router.post('/login', async (ctx) => {
          const { default: AuthController } = await import('#controllers/auth_controller')
          console.log(`POST /api/auth/login`, new Date().toISOString())
          return new AuthController().login(ctx)
        })
      })
      .prefix('/auth')
    router
      .group(() => {
        router.post('/status', async (ctx) => {
          const { default: UsersController } = await import('#controllers/users_controller')
          console.log(`POST /api/user/status`, new Date().toISOString())
          return new UsersController().updateStatus(ctx)
        })
        router.get('/reload', async (ctx) => {
          const { default: UsersController } = await import('#controllers/users_controller')
          console.log(`GET /api/user/reload`, new Date().toISOString())
          return new UsersController().reload(ctx)
        })
      })
      .prefix('/user')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
    router
      .group(() => {
        router.get('/me', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          console.log(`GET /api/user/me`, new Date().toISOString())
          return new ChannelController().listUserChannels(ctx)
        })
        router.get('/:name/users', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          const { name } = ctx.request.params()
          console.log(`GET /api/channel/${name}/users`, new Date().toISOString())
          return new ChannelController().listUsersInChannel(ctx)
        })
        router.delete('/:name', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          const { name } = ctx.request.params()
          console.log(`DELETE /api/channel/${name}`, new Date().toISOString())
          return new ChannelController().destroy(ctx)
        })
        router.get('/:name', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          const { name } = ctx.request.params()
          console.log(`GET /api/channel/${name}`, new Date().toISOString())
          return new ChannelController().getChannel(ctx)
        })
        router.post('/join', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          console.log(`POST /api/channel/join`, new Date().toISOString())
          return new ChannelController().join(ctx)
        })
        router.post('/:name/invite', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          const { name } = ctx.request.params()
          console.log(`POST /api/channel/${name}/invite`, new Date().toISOString())
          return new ChannelController().invite(ctx)
        })
        router.post('/:name/leave', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          const { name } = ctx.request.params()
          console.log(`POST /api/channel/${name}/leave`, new Date().toISOString())
          return new ChannelController().leave(ctx)
        })
        router.post('/kick', async (ctx) => {
          const { default: KickController } = await import('#controllers/kick_controller')
          console.log(`POST /api/channel/kick`, new Date().toISOString())
          return new KickController().voteKick(ctx)
        })
        router.post('/revoke', async (ctx) => {
          const { default: KickController } = await import('#controllers/kick_controller')
          console.log(`POST /api/channel/revoke`, new Date().toISOString())
          return new KickController().revoke(ctx)
        })
        router.get('/:name/messages', async (ctx) => {
          const { default: MessageController } = await import('#controllers/channels_controller')
          const { name } = ctx.request.params()
          console.log(`GET /api/channel/${name}/messages`, new Date().toISOString())
          return new MessageController().getPaginatedMessages(ctx)
        })
        router.post('/messages', async (ctx) => {
          const { default: MessageController } = await import('#controllers/message_controller')
          console.log(`POST /api/channel/messages`, new Date().toISOString())
          return new MessageController().sendMessage(ctx)
        })
        router.post('/typing/:channelId', async (ctx) => {
          const { default: ChannelController } = await import('#controllers/channels_controller')
          const { channelId } = ctx.request.params()
          console.log(`POST /api/channel/typing/${channelId}`, new Date().toISOString())
          return new ChannelController().announceTyping(ctx)
        })
      })
      .prefix('/channel')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .prefix('/api')
