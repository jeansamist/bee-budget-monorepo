import type Wallet from '#models/wallet'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class WalletTransformer extends BaseTransformer<Wallet> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'description',
      'walletTypeId',
      'image',
      'amount',
      'lastMonthsData',
      'evolution',
      'createdAt',
      'updatedAt',
    ])
  }
}
