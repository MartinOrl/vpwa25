import hash from "@adonisjs/core/services/hash"
import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'
import { UserStatus } from "frontend/src/utils/types/user.js"

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  public email!: string

  @column()
  public firstName!: string

  @column()
  public lastName!: string

  @column()
  public nickName!:string

  @column({ serializeAs: null })
  public password!: string

  @column()
  public profilePicture?: string

  @column()
  public status!: UserStatus

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}