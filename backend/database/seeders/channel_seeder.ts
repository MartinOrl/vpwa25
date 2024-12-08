import Channel from '#models/channel'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Channel.updateOrCreateMany('name', [
      {
        name: 'General',
        ownerId: 1,
        privacy: 'PUBLIC',
      },
      {
        name: 'Random',
        ownerId: 1,
        privacy: 'PUBLIC',
      },
      {
        name: 'Secret',
        ownerId: 1,
        privacy: 'PRIVATE',
      },
    ])
  }
}
