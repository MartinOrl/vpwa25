import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, belongsTo, afterCreate } from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Channel from '#models/channel'
import db from '@adonisjs/lucid/services/db'

export default class Message extends BaseModel {
  protected tableName = 'messages'

  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column({ columnName: 'content' })
  declare content: string

  @column.dateTime({ autoCreate: true, columnName: 'timestamp' })
  declare timestamp: DateTime

  @column({ columnName: 'sender_id' })
  declare senderID: number

  @column({ columnName: 'channel_id' })
  declare channelID: number

  @belongsTo(() => User, {
    foreignKey: 'sender_id',
  })
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Channel, {
    pivotTable: 'channel_user_messages',
    pivotForeignKey: 'message_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: false,
  })
  declare channels: ManyToMany<typeof Channel>

  @manyToMany(() => User, {
    pivotTable: 'channel_user_messages',
    pivotForeignKey: 'message_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: false,
  })
  declare users: ManyToMany<typeof User>

  @afterCreate()
  public static async addMessageToChannel(message: Message) {
    const channel = await Channel.find(message.channelID)
    if (!channel) {
      return
    }
    await channel.related('messages').attach({
      [message.id]: {
        user_id: message.senderID,
        channel_id: message.channelID,
        message_id: message.id,
      },
    })
  }
}
