import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, afterCreate } from '@adonisjs/lucid/orm'
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

  @column({ columnName: 'privacy' })
  declare privacy: 'PUBLIC' | 'PRIVATE'

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
    pivotTimestamps: false, // Automatically manage timestamps in pivot table if needed
    pivotColumns: ['role'], // Additional columns in the pivot table
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Message, {
    pivotTable: 'channel_user_messages',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'message_id',
    pivotTimestamps: false,
  })
  declare messages: ManyToMany<typeof Message>

  @afterCreate()
  public static async addOwnerToChannel(channel: Channel) {
    await channel.related('users').attach({
      [channel.ownerId]: {
        role: 'ADMIN',
      },
    })
  }
}
