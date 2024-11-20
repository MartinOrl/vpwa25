import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Message from '#models/message'

export default class Channel extends BaseModel {
  protected tableName = 'channels'

  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'owner_id' })
  declare ownerId: number

  @column({ columnName: 'type' })
  declare type: 'PUBLIC' | 'PRIVATE'

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'owner_id',
  })
  declare user: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'channel_users', // The name of the pivot table
    pivotTimestamps: true, // Automatically manage timestamps in pivot table if needed
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Message, {
    pivotTable: 'channel_user_messages',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'message_id',
    pivotTimestamps: true,
  })
  declare messages: ManyToMany<typeof Message>
}
