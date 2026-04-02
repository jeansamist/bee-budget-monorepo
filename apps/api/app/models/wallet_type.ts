import { WalletTypeSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
import IncomeCategory from './income_category.ts'
import User from './user.ts'
import Wallet from './wallet.ts'

export default class WalletType extends WalletTypeSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Wallet)
  declare wallets: HasMany<typeof Wallet>

  @hasMany(() => IncomeCategory, {
    foreignKey: 'defaultWalletTypeId',
  })
  declare defaultIncomeCategories: HasMany<typeof IncomeCategory>
}
