import { DateTime } from 'luxon'
import { BaseModel, column,manyToMany,belongsTo } from '@adonisjs/lucid/orm'
import type { ManyToMany,BelongsTo } from '@adonisjs/lucid/types/relations'

import User from "#models/user"
import Channel from "#models/channel"

export default class Message extends BaseModel {
protected tableName = 'messages'

  @column({ isPrimary: true,columnName: 'id' })
  declare messageID: number

  @column({columnName: 'content'})
  declare content: string

  @column.dateTime({ autoCreate: true, columnName: 'timestamp' })
  declare timestamp: DateTime

  @column({columnName: 'isHighlighted'})
  declare isHighlighted: boolean

  @column({columnName: 'sender_id'})
  declare senderID: number

  @column({columnName: 'channel_id'})
  declare channelID: number


  @belongsTo(() => User, {
    foreignKey: 'sender_id',
  })
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Channel, {
    pivotTable: 'channel_user_messages',
    pivotForeignKey: 'message_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: true,       
  })
  declare channels: ManyToMany<typeof Channel>

  @manyToMany(() => User, {
    pivotTable: 'channel_user_messages',
    pivotForeignKey: 'message_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,       
  })
  declare users: ManyToMany<typeof User>
}