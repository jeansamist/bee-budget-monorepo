import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'expense_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.string('icon').nullable()
      table.string('color').notNullable()
      table
        .integer('default_wallet_type_id')
        .unsigned()
        .references('id')
        .inTable('wallet_types')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('default_contact_id')
        .unsigned()
        .references('id')
        .inTable('contacts')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
