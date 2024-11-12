import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channels'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')  // Primary key
      table.string('name').notNullable().unique()  // Channel name, must be unique
      table.integer('owner_id').unsigned().references('userID').inTable('users').onDelete('CASCADE')  // Foreign key to users table
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}