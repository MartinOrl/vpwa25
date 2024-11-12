import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo,manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'




export default class Channel extends BaseModel {
  protected tableName = 'channels'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare ownerId: number
 
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare user: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'channel_user',  // The name of the pivot table
    pivotTimestamps: true,       // Automatically manage timestamps in pivot table if needed
  })
  declare users: ManyToMany<typeof User>
}


