import { IncomeSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Contact from './contact.ts'
import IncomeCategory from './income_category.ts'
import InternalTransfer from './internal_transfer.ts'
import User from './user.ts'
import Wallet from './wallet.ts'

export default class Income extends IncomeSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => IncomeCategory)
  declare incomeCategory: BelongsTo<typeof IncomeCategory>

  @belongsTo(() => Wallet)
  declare wallet: BelongsTo<typeof Wallet>

  @belongsTo(() => Contact, {
    foreignKey: 'fromContactId',
  })
  declare fromContact: BelongsTo<typeof Contact>

  @belongsTo(() => InternalTransfer, {
    foreignKey: 'internalTransferId',
  })
  declare internalTransfer: BelongsTo<typeof InternalTransfer>

  get isInternalTransfer() {
    return this.internalTransferId !== null
  }
}
