import { ACCOUNT_SETUP_WALLETS } from '#constants/index'
import User from '#models/user'
import Wallet from '#models/wallet'
import WalletType from '#models/wallet_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class WalletSeeder extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'demo@beebudget.app')

    const existing = await Wallet.query().where('user_id', user.id).count('* as total')
    if (Number(existing[0].$extras.total) > 0) return

    const walletTypes = await WalletType.query().where('user_id', user.id)
    const typeIdByName = new Map(walletTypes.map((wt) => [wt.name, wt.id]))

    await Wallet.createMany(
      ACCOUNT_SETUP_WALLETS.map((w) => ({
        name: w.name,
        description: w.description,
        image: w.image,
        amount: w.amount,
        walletTypeId: typeIdByName.get(w.walletTypeName)!,
        userId: user.id,
      }))
    )
  }
}
