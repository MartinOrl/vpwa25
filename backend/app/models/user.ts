import { DbAccessTokensProvider } from "@adonisjs/auth/access_tokens"
import hash from "@adonisjs/core/services/hash"
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, beforeSave,manyToMany } from '@adonisjs/lucid/orm'
import { UserStatus } from "frontend/src/utils/types/user.js"
import Channel from "#models/channel"

export default class User extends BaseModel{
protected tableName = 'users'

  @column({ isPrimary: true, columnName: 'userID' })
  declare id: number

  @column()
  declare email: string

  @column({columnName: 'firstName'})
  declare firstName: string

  @column({columnName: 'lastName'})
  declare lastName: string

  @column({columnName: 'nickName'})
  declare nickName:string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare profilePicture?: string

  @column()
  declare status: typeof UserStatus

  @manyToMany(() => Channel, {
    pivotTable: 'channel_user',  // The name of the pivot table
    pivotTimestamps: true,       // Automatically manage timestamps in pivot table if needed
  })
  declare channels: ManyToMany<typeof Channel>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    tokenSecretLength: 40,
    type: 'auth_token',
    table: 'access_tokens',
    prefix: '_'
  })


  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}