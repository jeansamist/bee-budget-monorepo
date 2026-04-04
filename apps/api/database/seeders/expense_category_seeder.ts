import { ACCOUNT_SETUP_EXPENSE_CATEGORIES } from '#constants/index'
import ExpenseCategory from '#models/expense_category'
import User from '#models/user'
import WalletType from '#models/wallet_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class ExpenseCategorySeeder extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'demo@beebudget.app')

    const existing = await ExpenseCategory.query().where('user_id', user.id).count('* as total')
    if (Number(existing[0].$extras.total) > 0) return

    const walletTypes = await WalletType.query().where('user_id', user.id)
    const typeIdByName = new Map(walletTypes.map((wt) => [wt.name, wt.id]))

    await ExpenseCategory.createMany(
      ACCOUNT_SETUP_EXPENSE_CATEGORIES.map((category) => ({
        name: category.name,
        color: category.color,
        icon: category.icon,
        defaultWalletTypeId: category.defaultWalletTypeName
          ? (typeIdByName.get(category.defaultWalletTypeName) ?? null)
          : null,
        defaultContactId: null,
        userId: user.id,
      }))
    )
  }
}
