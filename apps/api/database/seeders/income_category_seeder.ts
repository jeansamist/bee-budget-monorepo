import { ACCOUNT_SETUP_INCOME_CATEGORIES } from '#constants/index'
import IncomeCategory from '#models/income_category'
import User from '#models/user'
import WalletType from '#models/wallet_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class IncomeCategorySeeder extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'demo@beebudget.app')

    const walletTypes = await WalletType.query().where('user_id', user.id)
    const typeIdByName = new Map(walletTypes.map((wt) => [wt.name, wt.id]))

    for (const ic of ACCOUNT_SETUP_INCOME_CATEGORIES) {
      await IncomeCategory.updateOrCreate(
        { userId: user.id, name: ic.name },
        {
          name: ic.name,
          color: ic.color,
          icon: ic.icon,
          defaultWalletTypeId: ic.defaultWalletTypeName
            ? (typeIdByName.get(ic.defaultWalletTypeName) ?? null)
            : null,
          defaultContactId: null,
          isSystem: ic.isSystem,
          userId: user.id,
        }
      )
    }
  }
}
