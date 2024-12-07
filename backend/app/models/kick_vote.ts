import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class KickVote extends BaseModel {
  protected tableName = 'kick_votes'
  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'channel_id' })
  declare channelId: number

  @column({ columnName: 'voted_by' })
  declare votedBy: number
}
