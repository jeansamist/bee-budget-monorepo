import { ContactSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
import IncomeCategory from './income_category.ts'
import Income from './income.ts'
import User from './user.ts'

export default class Contact extends ContactSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Income, {
    foreignKey: 'fromContactId',
  })
  declare incomes: HasMany<typeof Income>

  @hasMany(() => IncomeCategory, {
    foreignKey: 'defaultContactId',
  })
  declare defaultIncomeCategories: HasMany<typeof IncomeCategory>
}
