import { ACCOUNT_SETUP_WALLET_TYPES } from '#constants/index'
import User from '#models/user'
import WalletType from '#models/wallet_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class WalletTypeSeeder extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'demo@beebudget.app')

    const existing = await WalletType.query().where('user_id', user.id).count('* as total')
    if (Number(existing[0].$extras.total) > 0) return

    await WalletType.createMany(
      ACCOUNT_SETUP_WALLET_TYPES.map((wt) => ({ ...wt, userId: user.id }))
    )
  }
}
