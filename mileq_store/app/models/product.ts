import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare mainMediaUrl: string | null  // peut être image ou vidéo

  @column()
  declare price?: number | null  // prix du produit phare si applicable

  @column()
  declare mainMediaType?: 'image' | 'video' | null  // type du média

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}