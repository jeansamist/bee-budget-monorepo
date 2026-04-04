import { ExpenseSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Contact from './contact.ts'
import ExpenseCategory from './expense_category.ts'
import InternalTransfer from './internal_transfer.ts'
import User from './user.ts'
import Wallet from './wallet.ts'

export default class Expense extends ExpenseSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => ExpenseCategory)
  declare expenseCategory: BelongsTo<typeof ExpenseCategory>

  @belongsTo(() => Wallet)
  declare wallet: BelongsTo<typeof Wallet>

  @belongsTo(() => Contact, {
    foreignKey: 'toContactId',
  })
  declare toContact: BelongsTo<typeof Contact>

  @belongsTo(() => InternalTransfer, {
    foreignKey: 'internalTransferId',
  })
  declare internalTransfer: BelongsTo<typeof InternalTransfer>

  get isInternalTransfer() {
    return this.internalTransferId !== null
  }
}
