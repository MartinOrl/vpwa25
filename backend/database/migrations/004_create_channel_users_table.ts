import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channel_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // Foreign key to users table
      table
        .integer('channel_id')
        .unsigned()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE') // Foreign key to channels table
      table.enum('role', ['ADMIN', 'MEMBER']).notNullable().defaultTo('MEMBER') // Role of the user in the channel
      table.timestamp('joined_at', { useTz: true }).defaultTo(this.now()) // Optional: Track when the user joined the channel
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
