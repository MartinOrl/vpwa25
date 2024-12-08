import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kick_votes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // User being voted to be kicked
      table
        .integer('channel_id')
        .unsigned()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE') // Channel where the vote is happening
      table.integer('voted_by').unsigned().references('id').inTable('users').onDelete('CASCADE') // User casting the vote
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()) // Timestamp of the vote
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
