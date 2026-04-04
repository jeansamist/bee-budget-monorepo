import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'internal_transfers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.integer('amount').notNullable()
      table.integer('fee').nullable()
      table
        .integer('source_wallet_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('wallets')
        .onDelete('CASCADE')
      table
        .integer('target_wallet_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('wallets')
        .onDelete('CASCADE')
      table
        .integer('linked_expense_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('expenses')
        .onDelete('SET NULL')
      table
        .integer('linked_income_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('incomes')
        .onDelete('SET NULL')
      table.date('date').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
