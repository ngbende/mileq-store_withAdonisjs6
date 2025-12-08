import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ProductVariant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

    @column()
  declare productId: number

  @column()
  declare color: string | null

  @column()
  declare size: string | null

  @column()
  declare otherAttr: string | null

  @column()
  declare mediaUrl: string | null  // image ou vidéo

  @column()
  declare mediaType: 'image' | 'video' | null

  @column()
  declare stock: number | null

  @column()
  declare price: number | null  // valeur numérique, devise gérée côté front

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}