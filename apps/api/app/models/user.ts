import { UserSchema } from '#database/schema'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { hasMany } from '@adonisjs/lucid/orm'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import Income from './income.ts'
import IncomeCategory from './income_category.ts'
import Wallet from './wallet.ts'
import WalletType from './wallet_type.ts'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @hasMany(() => IncomeCategory)
  declare incomeCategories: HasMany<typeof IncomeCategory>

  @hasMany(() => Income)
  declare incomes: HasMany<typeof Income>

  @hasMany(() => Wallet)
  declare wallets: HasMany<typeof Wallet>

  @hasMany(() => WalletType)
  declare walletTypes: HasMany<typeof WalletType>

  get initials() {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase()
  }
}
