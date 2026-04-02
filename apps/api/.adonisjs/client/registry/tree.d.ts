/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    signUp: typeof routes['auth.sign_up']
    verifyEmail: typeof routes['auth.verify_email']
    signIn: typeof routes['auth.sign_in']
    forgotPassword: typeof routes['auth.forgot_password']
    resetPassword: typeof routes['auth.reset_password']
    logout: typeof routes['auth.logout']
    deleteAccount: typeof routes['auth.delete_account']
    profile: typeof routes['auth.profile']
    updateProfile: typeof routes['auth.update_profile']
  }
  incomeCategories: {
    index: typeof routes['income_categories.index']
    store: typeof routes['income_categories.store']
    show: typeof routes['income_categories.show']
    update: typeof routes['income_categories.update']
    destroy: typeof routes['income_categories.destroy']
  }
  incomes: {
    index: typeof routes['incomes.index']
    store: typeof routes['incomes.store']
    show: typeof routes['incomes.show']
    update: typeof routes['incomes.update']
    destroy: typeof routes['incomes.destroy']
  }
  walletTypes: {
    index: typeof routes['wallet_types.index']
    store: typeof routes['wallet_types.store']
    show: typeof routes['wallet_types.show']
    update: typeof routes['wallet_types.update']
    destroy: typeof routes['wallet_types.destroy']
  }
  wallets: {
    index: typeof routes['wallets.index']
    store: typeof routes['wallets.store']
    show: typeof routes['wallets.show']
    update: typeof routes['wallets.update']
    destroy: typeof routes['wallets.destroy']
  }
}
