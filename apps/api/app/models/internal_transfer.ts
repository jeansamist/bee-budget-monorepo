import { InternalTransferSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Expense from './expense.ts'
import Income from './income.ts'
import User from './user.ts'
import Wallet from './wallet.ts'

export default class InternalTransfer extends InternalTransferSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Wallet, {
    foreignKey: 'sourceWalletId',
  })
  declare sourceWallet: BelongsTo<typeof Wallet>

  @belongsTo(() => Wallet, {
    foreignKey: 'targetWalletId',
  })
  declare targetWallet: BelongsTo<typeof Wallet>

  @belongsTo(() => Expense, {
    foreignKey: 'linkedExpenseId',
  })
  declare linkedExpense: BelongsTo<typeof Expense>

  @belongsTo(() => Income, {
    foreignKey: 'linkedIncomeId',
  })
  declare linkedIncome: BelongsTo<typeof Income>
}
