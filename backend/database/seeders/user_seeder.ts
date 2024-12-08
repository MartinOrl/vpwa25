import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.updateOrCreateMany('email', [
      {
        email: 'joedoe@example.com',
        password: 'password',
        firstName: 'Joe',
        lastName: 'Doe',
        nickName: 'JoeDoe',
      },
      {
        email: 'janedoe@example.com',
        password: 'password',
        firstName: 'Jane',
        lastName: 'Doe',
        nickName: 'JaneDoe',
      },
      {
        email: 'alice@example.com',
        password: 'password',
        firstName: 'Alice',
        lastName: 'Smith',
        nickName: 'AliceSmith',
      },
      {
        email: 'bob@example.com',
        password: 'password',
        firstName: 'Bob',
        lastName: 'Brown',
        nickName: 'BobBrown',
      },
      {
        email: 'charlie@example.com',
        password: 'password',
        firstName: 'Charlie',
        lastName: 'Davis',
        nickName: 'CharlieDavis',
      },
      {
        email: 'david@example.com',
        password: 'password',
        firstName: 'David',
        lastName: 'Evans',
        nickName: 'DavidEvans',
      },
      {
        email: 'eve@example.com',
        password: 'password',
        firstName: 'Eve',
        lastName: 'Foster',
        nickName: 'EveFoster',
      },
      {
        email: 'frank@example.com',
        password: 'password',
        firstName: 'Frank',
        lastName: 'Green',
        nickName: 'FrankGreen',
      },
      {
        email: 'grace@example.com',
        password: 'password',
        firstName: 'Grace',
        lastName: 'Harris',
        nickName: 'GraceHarris',
      },
      {
        email: 'henry@example.com',
        password: 'password',
        firstName: 'Henry',
        lastName: 'Irvine',
        nickName: 'HenryIrvine',
      },
    ])
  }
}
