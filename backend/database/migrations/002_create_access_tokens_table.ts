import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'access_tokens'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('abilities').nullable()
      table.string('hash').nullable()
      table.string('last_used_at').nullable()
      table.string('name').nullable()
      table.string('tokenable_id').nullable()
      table.string('type').nullable()
      table.string('token', 64).nullable().unique()
      table.timestamp('expires_at').nullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}