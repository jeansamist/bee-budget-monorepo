import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'expenses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.string('description').notNullable()
      table.integer('amount').notNullable()
      table.integer('fees').nullable()
      table.date('date').notNullable()
      table
        .integer('expense_category_id')
        .unsigned()
        .references('id')
        .inTable('expense_categories')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('wallet_id')
        .unsigned()
        .references('id')
        .inTable('wallets')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('to_contact_id')
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
