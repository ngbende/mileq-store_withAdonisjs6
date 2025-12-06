import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_variants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
       table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE')
      table.string('color').nullable()
      table.string('size').nullable()
      table.string('other_attr').nullable()
      table.string('media_url').nullable()
      table.string('media_type').nullable()
      table.integer('stock').nullable()
      table.float('price').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}