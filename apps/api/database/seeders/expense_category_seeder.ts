import { ACCOUNT_SETUP_EXPENSE_CATEGORIES } from '#constants/index'
import ExpenseCategory from '#models/expense_category'
import User from '#models/user'
import WalletType from '#models/wallet_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class ExpenseCategorySeeder extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'demo@beebudget.app')

    const walletTypes = await WalletType.query().where('user_id', user.id)
    const typeIdByName = new Map(walletTypes.map((wt) => [wt.name, wt.id]))

    for (const category of ACCOUNT_SETUP_EXPENSE_CATEGORIES) {
      await ExpenseCategory.updateOrCreate(
        { userId: user.id, name: category.name },
        {
          name: category.name,
          color: category.color,
          icon: category.icon,
          defaultWalletTypeId: category.defaultWalletTypeName
            ? (typeIdByName.get(category.defaultWalletTypeName) ?? null)
            : null,
          defaultContactId: null,
          isSystem: category.isSystem,
          userId: user.id,
        }
      )
    }
  }
}
