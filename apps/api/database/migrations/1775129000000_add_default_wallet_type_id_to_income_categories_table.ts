import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'income_categories'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('default_wallet_type_id')
        .unsigned()
        .references('id')
        .inTable('wallet_types')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('default_wallet_type_id')
    })
  }
}
