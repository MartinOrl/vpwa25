import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unsigned().defaultTo(1) // Equivalent to SERIAL, auto-incrementing primary key starting from 1
      table.string('firstName').notNullable() // firstName column
      table.string('lastName').notNullable() // lastName column
      table.string('nickName').unique().notNullable() // nickName column, unique
      table.string('email').notNullable() // email column
      table.string('password').notNullable() // password column
      table.string('profilePicture').nullable() // profilePicture column, optional
      table
        .enum('status', ['OFFLINE', 'ONLINE', 'DO_NOT_DISTURB'])
        .notNullable()
        .defaultTo('ONLINE') // status column, ENUM
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
