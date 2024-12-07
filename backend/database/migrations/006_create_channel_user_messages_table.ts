import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channel_user_messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // Foreign key to users
      table
        .integer('channel_id')
        .unsigned()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE') // Foreign key to channels
      table
        .integer('message_id')
        .unsigned()
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE') // Foreign key to messages
      table.boolean('is_read').defaultTo(false) // To track if the user has read the message
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()) // When the association was created
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
