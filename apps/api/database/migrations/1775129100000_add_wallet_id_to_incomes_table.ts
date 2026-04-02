import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'incomes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('wallet_id')
        .unsigned()
        .references('id')
        .inTable('wallets')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('wallet_id')
    })
  }
}
