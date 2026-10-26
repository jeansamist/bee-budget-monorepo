import type Budget from '#models/budget'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class BudgetTransformer extends BaseTransformer<Budget> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'targetType',
      'expenseCategoryId',
      'walletId',
      'amount',
      'period',
      'alertThreshold',
      'spent',
      'remaining',
      'progress',
      'status',
      'periodStart',
      'periodEnd',
      'createdAt',
      'updatedAt',
    ])
  }
}
