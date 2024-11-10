import { DbAccessTokensProvider } from "@adonisjs/auth/access_tokens"
import hash from "@adonisjs/core/services/hash"
import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'
import { UserStatus } from "frontend/src/utils/types/user.js"

export default class User extends BaseModel{
  @column({ isPrimary: true, columnName: 'userID' })
  declare id: number

  @column()
  public email!: string

  @column({columnName: 'firstName'})
  public firstName!: string

  @column({columnName: 'lastName'})
  public lastName!: string

  @column({columnName: 'nickName'})
  public nickName!:string

  @column({ serializeAs: null })
  public password!: string

  @column()
  public profilePicture?: string

  @column()
  public status!: typeof UserStatus

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