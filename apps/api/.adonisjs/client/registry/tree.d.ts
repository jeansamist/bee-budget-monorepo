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
  contacts: {
    createMass: typeof routes['contacts.create_mass']
    updateMass: typeof routes['contacts.update_mass']
    deleteMass: typeof routes['contacts.delete_mass']
    index: typeof routes['contacts.index']
    store: typeof routes['contacts.store']
    show: typeof routes['contacts.show']
    update: typeof routes['contacts.update']
    destroy: typeof routes['contacts.destroy']
  }
  expenseCategories: {
    createMass: typeof routes['expense_categories.create_mass']
    updateMass: typeof routes['expense_categories.update_mass']
    deleteMass: typeof routes['expense_categories.delete_mass']
    index: typeof routes['expense_categories.index']
    store: typeof routes['expense_categories.store']
    show: typeof routes['expense_categories.show']
    update: typeof routes['expense_categories.update']
    destroy: typeof routes['expense_categories.destroy']
  }
  expenses: {
    createMass: typeof routes['expenses.create_mass']
    updateMass: typeof routes['expenses.update_mass']
    deleteMass: typeof routes['expenses.delete_mass']
    index: typeof routes['expenses.index']
    store: typeof routes['expenses.store']
    show: typeof routes['expenses.show']
    update: typeof routes['expenses.update']
    destroy: typeof routes['expenses.destroy']
  }
  internalTransfers: {
    createMass: typeof routes['internal_transfers.create_mass']
    updateMass: typeof routes['internal_transfers.update_mass']
    deleteMass: typeof routes['internal_transfers.delete_mass']
    index: typeof routes['internal_transfers.index']
    store: typeof routes['internal_transfers.store']
    show: typeof routes['internal_transfers.show']
    update: typeof routes['internal_transfers.update']
    destroy: typeof routes['internal_transfers.destroy']
  }
  incomeCategories: {
    createMass: typeof routes['income_categories.create_mass']
    updateMass: typeof routes['income_categories.update_mass']
    deleteMass: typeof routes['income_categories.delete_mass']
    index: typeof routes['income_categories.index']
    store: typeof routes['income_categories.store']
    show: typeof routes['income_categories.show']
    update: typeof routes['income_categories.update']
    destroy: typeof routes['income_categories.destroy']
  }
  incomes: {
    createMass: typeof routes['incomes.create_mass']
    updateMass: typeof routes['incomes.update_mass']
    deleteMass: typeof routes['incomes.delete_mass']
    index: typeof routes['incomes.index']
    store: typeof routes['incomes.store']
    show: typeof routes['incomes.show']
    update: typeof routes['incomes.update']
    destroy: typeof routes['incomes.destroy']
  }
  walletTypes: {
    createMass: typeof routes['wallet_types.create_mass']
    updateMass: typeof routes['wallet_types.update_mass']
    deleteMass: typeof routes['wallet_types.delete_mass']
    index: typeof routes['wallet_types.index']
    store: typeof routes['wallet_types.store']
    show: typeof routes['wallet_types.show']
    update: typeof routes['wallet_types.update']
    destroy: typeof routes['wallet_types.destroy']
  }
  wallets: {
    createMass: typeof routes['wallets.create_mass']
    updateMass: typeof routes['wallets.update_mass']
    deleteMass: typeof routes['wallets.delete_mass']
    index: typeof routes['wallets.index']
    store: typeof routes['wallets.store']
    show: typeof routes['wallets.show']
    update: typeof routes['wallets.update']
    destroy: typeof routes['wallets.destroy']
  }
}
