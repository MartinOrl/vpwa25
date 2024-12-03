import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key, similar to SERIAL in SQL
      table.text('content').notNullable() // Content of the message
      table.timestamp('timestamp', { useTz: true }).defaultTo(this.now()) // When the message was created

      // Foreign keys
      table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // User who sent the message
      table
        .integer('channel_id')
        .unsigned()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE') // Channel where the message was sent
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
