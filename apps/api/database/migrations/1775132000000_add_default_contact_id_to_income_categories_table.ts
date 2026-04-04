import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'income_categories'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('default_contact_id')
        .unsigned()
        .references('id')
        .inTable('contacts')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('default_contact_id')
    })
  }
}
