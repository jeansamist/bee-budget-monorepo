import { ACCOUNT_SETUP_INCOME_CATEGORIES } from '#constants/index'
import IncomeCategory from '#models/income_category'
import User from '#models/user'
import WalletType from '#models/wallet_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class IncomeCategorySeeder extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'demo@beebudget.app')

    const existing = await IncomeCategory.query().where('user_id', user.id).count('* as total')
    if (Number(existing[0].$extras.total) > 0) return

    const walletTypes = await WalletType.query().where('user_id', user.id)
    const typeIdByName = new Map(walletTypes.map((wt) => [wt.name, wt.id]))

    await IncomeCategory.createMany(
      ACCOUNT_SETUP_INCOME_CATEGORIES.map((ic) => ({
        name: ic.name,
        color: ic.color,
        icon: ic.icon,
        defaultWalletTypeId: ic.defaultWalletTypeName
          ? (typeIdByName.get(ic.defaultWalletTypeName) ?? null)
          : null,
        defaultContactId: null,
        userId: user.id,
      }))
    )
  }
}
