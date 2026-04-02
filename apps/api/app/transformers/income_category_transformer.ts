import type IncomeCategory from '#models/income_category'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class IncomeCategoryTransformer extends BaseTransformer<IncomeCategory> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'createdAt',
      'updatedAt',
      'icon',
      'color',
      'defaultWalletTypeId',
    ])
  }
}
