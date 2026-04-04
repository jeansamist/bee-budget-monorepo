import type ExpenseCategory from '#models/expense_category'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ExpenseCategoryTransformer extends BaseTransformer<ExpenseCategory> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'createdAt',
      'updatedAt',
      'icon',
      'color',
      'defaultWalletTypeId',
      'defaultContactId',
    ])
  }
}
