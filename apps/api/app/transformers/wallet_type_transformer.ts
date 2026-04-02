import WalletType from '#models/wallet_type'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class WalletTypeTransformer extends BaseTransformer<WalletType> {
  toObject() {
    return this.pick(this.resource, ['id', 'name', 'color', 'icon', 'createdAt', 'updatedAt'])
  }
}
