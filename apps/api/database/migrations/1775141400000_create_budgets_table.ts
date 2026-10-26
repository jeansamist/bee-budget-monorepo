import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'budgets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      // What the budget caps: one expense category or one wallet
      table.enum('target_type', ['expense_category', 'wallet']).notNullable()
      table
        .integer('expense_category_id')
        .unsigned()
        .references('id')
        .inTable('expense_categories')
        .onDelete('CASCADE')
        .nullable()
      table
        .integer('wallet_id')
        .unsigned()
        .references('id')
        .inTable('wallets')
        .onDelete('CASCADE')
        .nullable()
      table.integer('amount').notNullable()
      table.enum('period', ['weekly', 'monthly', 'yearly']).notNullable().defaultTo('monthly')
      // Percentage of the amount at which the budget is flagged as close to its limit
      table.integer('alert_threshold').notNullable().defaultTo(80)
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
