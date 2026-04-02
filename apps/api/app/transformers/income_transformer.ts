import Income from '#models/income'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class IncomeTransformer extends BaseTransformer<Income> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'description',
      'amount',
      'date',
      'incomeCategoryId',
      'createdAt',
      'updatedAt',
    ])
  }
}
