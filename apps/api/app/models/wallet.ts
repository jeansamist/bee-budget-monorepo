import { WalletSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
import Expense from './expense.ts'
import Income from './income.ts'
import User from './user.ts'
import WalletType from './wallet_type.ts'

export default class Wallet extends WalletSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => WalletType)
  declare walletType: BelongsTo<typeof WalletType>

  @hasMany(() => Income)
  declare incomes: HasMany<typeof Income>

  @hasMany(() => Expense)
  declare expenses: HasMany<typeof Expense>
}
