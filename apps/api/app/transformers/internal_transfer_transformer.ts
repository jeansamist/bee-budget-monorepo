import type InternalTransfer from '#models/internal_transfer'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class InternalTransferTransformer extends BaseTransformer<InternalTransfer> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'description',
      'amount',
      'fee',
      'sourceWalletId',
      'targetWalletId',
      'linkedExpenseId',
      'linkedIncomeId',
      'date',
      'createdAt',
      'updatedAt',
    ])
  }
}
