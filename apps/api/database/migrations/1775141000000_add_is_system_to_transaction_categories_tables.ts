import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableNames = ['income_categories', 'expense_categories']

  async up() {
    for (const tableName of this.tableNames) {
      this.schema.alterTable(tableName, (table) => {
        table.boolean('is_system').notNullable().defaultTo(false)
      })
    }
  }

  async down() {
    for (const tableName of this.tableNames) {
      this.schema.alterTable(tableName, (table) => {
        table.dropColumn('is_system')
      })
    }
  }
}
