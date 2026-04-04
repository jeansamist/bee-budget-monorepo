import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'incomes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('from_contact_id')
        .unsigned()
        .references('id')
        .inTable('contacts')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('from_contact_id')
    })
  }
}
