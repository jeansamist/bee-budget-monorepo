import { ExpenseCategorySchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
import Contact from './contact.ts'
import Expense from './expense.ts'
import User from './user.ts'
import WalletType from './wallet_type.ts'

export default class ExpenseCategory extends ExpenseCategorySchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => WalletType, {
    foreignKey: 'defaultWalletTypeId',
  })
  declare defaultWalletType: BelongsTo<typeof WalletType>

  @belongsTo(() => Contact, {
    foreignKey: 'defaultContactId',
  })
  declare defaultContact: BelongsTo<typeof Contact>

  @hasMany(() => Expense)
  declare expenses: HasMany<typeof Expense>

  get isTransferCategory() {
    return this.isSystem
  }
}
