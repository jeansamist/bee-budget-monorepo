import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('incomes', (table) => {
      table.integer('internal_transfer_id').unsigned().nullable()
      table
        .foreign('internal_transfer_id')
        .references('id')
        .inTable('internal_transfers')
        .onDelete('SET NULL')
    })

    this.schema.alterTable('expenses', (table) => {
      table.integer('internal_transfer_id').unsigned().nullable()
      table
        .foreign('internal_transfer_id')
        .references('id')
        .inTable('internal_transfers')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable('incomes', (table) => {
      table.dropForeign(['internal_transfer_id'])
      table.dropColumn('internal_transfer_id')
    })

    this.schema.alterTable('expenses', (table) => {
      table.dropForeign(['internal_transfer_id'])
      table.dropColumn('internal_transfer_id')
    })
  }
}
