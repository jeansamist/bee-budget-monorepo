import { IncomeSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import IncomeCategory from './income_category.ts'
import User from './user.ts'

export default class Income extends IncomeSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => IncomeCategory)
  declare incomeCategory: BelongsTo<typeof IncomeCategory>
}
