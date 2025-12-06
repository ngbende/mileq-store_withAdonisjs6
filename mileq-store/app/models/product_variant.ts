import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ProductVariant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

    @column()
  declare productId: number

  @column()
  declare color?: string

  @column()
  declare size?: string

  @column()
  declare otherAttr?: string

  @column()
  declare mediaUrl?: string  // image ou vidéo

  @column()
  declare mediaType?: 'image' | 'video'

  @column()
  declare stock?: number

  @column()
  declare price?: number  // valeur numérique, devise gérée côté front

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}