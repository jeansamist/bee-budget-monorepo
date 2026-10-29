import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_providers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.enum('provider', ['openai', 'anthropic', 'google', 'mistral']).notNullable()
      // Encrypted with the app key, never sent back to the client
      table.text('api_key').notNullable()
      // Last 4 characters, to tell keys apart in the UI
      table.string('key_hint', 8).notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.unique(['user_id', 'provider'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
