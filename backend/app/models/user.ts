import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, beforeSave, manyToMany } from '@adonisjs/lucid/orm'
import { UserStatus } from 'frontend/src/utils/types/user.js'
import Channel from '#models/channel'
import Message from '#models/message'

export default class User extends BaseModel {
  protected tableName = 'users'

  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column()
  declare email: string

  @column({ columnName: 'firstName' })
  declare firstName: string

  @column({ columnName: 'lastName' })
  declare lastName: string

  @column({ columnName: 'nickName' })
  declare nickName: string

  @column({ serializeAs: null, columnName: 'password' })
  declare password: string

  @column({ columnName: 'profilePicture' })
  declare profilePicture?: string

  @column({ columnName: 'status' })
  declare status: typeof UserStatus

  @manyToMany(() => Channel, {
    pivotTable: 'channel_users', // The name of the pivot table
    pivotTimestamps: false, // Automatically manage timestamps in pivot table if needed
    pivotColumns: ['role'], // Additional columns in the pivot table
  })
  declare channels: ManyToMany<typeof Channel>

  @manyToMany(() => Message, {
    pivotTable: 'channel_user_messages',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'message_id',
    pivotTimestamps: false,
  })
  declare messages: ManyToMany<typeof Message>

  declare accessTokens: ReturnType<typeof DbAccessTokensProvider.forModel>
  public static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days', // Token expiration time
    tokenSecretLength: 40, // Length of the token secret
    type: 'auth_token', // Token type
    table: 'access_tokens', // Table to store tokens
    prefix: 'oat_', // Prefix for the token
  })

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}
