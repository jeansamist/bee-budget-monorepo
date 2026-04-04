import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.sign_up': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple?: []; params?: {} }
    'auth.sign_in': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.delete_account': { paramsTuple?: []; params?: {} }
    'auth.profile': { paramsTuple?: []; params?: {} }
    'auth.update_profile': { paramsTuple?: []; params?: {} }
    'contacts.create_mass': { paramsTuple?: []; params?: {} }
    'contacts.update_mass': { paramsTuple?: []; params?: {} }
    'contacts.delete_mass': { paramsTuple?: []; params?: {} }
    'expense_categories.create_mass': { paramsTuple?: []; params?: {} }
    'expense_categories.update_mass': { paramsTuple?: []; params?: {} }
    'expense_categories.delete_mass': { paramsTuple?: []; params?: {} }
    'expenses.create_mass': { paramsTuple?: []; params?: {} }
    'expenses.update_mass': { paramsTuple?: []; params?: {} }
    'expenses.delete_mass': { paramsTuple?: []; params?: {} }
    'internal_transfers.create_mass': { paramsTuple?: []; params?: {} }
    'internal_transfers.update_mass': { paramsTuple?: []; params?: {} }
    'internal_transfers.delete_mass': { paramsTuple?: []; params?: {} }
    'transaction_analytics.index': { paramsTuple?: []; params?: {} }
    'income_categories.create_mass': { paramsTuple?: []; params?: {} }
    'income_categories.update_mass': { paramsTuple?: []; params?: {} }
    'income_categories.delete_mass': { paramsTuple?: []; params?: {} }
    'incomes.create_mass': { paramsTuple?: []; params?: {} }
    'incomes.update_mass': { paramsTuple?: []; params?: {} }
    'incomes.delete_mass': { paramsTuple?: []; params?: {} }
    'wallet_types.create_mass': { paramsTuple?: []; params?: {} }
    'wallet_types.update_mass': { paramsTuple?: []; params?: {} }
    'wallet_types.delete_mass': { paramsTuple?: []; params?: {} }
    'wallets.create_mass': { paramsTuple?: []; params?: {} }
    'wallets.update_mass': { paramsTuple?: []; params?: {} }
    'wallets.delete_mass': { paramsTuple?: []; params?: {} }
    'contacts.index': { paramsTuple?: []; params?: {} }
    'contacts.store': { paramsTuple?: []; params?: {} }
    'contacts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expense_categories.index': { paramsTuple?: []; params?: {} }
    'expense_categories.store': { paramsTuple?: []; params?: {} }
    'expense_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expense_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expense_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expenses.index': { paramsTuple?: []; params?: {} }
    'expenses.store': { paramsTuple?: []; params?: {} }
    'expenses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expenses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expenses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'income_categories.index': { paramsTuple?: []; params?: {} }
    'income_categories.store': { paramsTuple?: []; params?: {} }
    'income_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'income_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'income_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal_transfers.index': { paramsTuple?: []; params?: {} }
    'internal_transfers.store': { paramsTuple?: []; params?: {} }
    'internal_transfers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal_transfers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal_transfers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.index': { paramsTuple?: []; params?: {} }
    'incomes.store': { paramsTuple?: []; params?: {} }
    'incomes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet_types.index': { paramsTuple?: []; params?: {} }
    'wallet_types.store': { paramsTuple?: []; params?: {} }
    'wallet_types.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet_types.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallets.index': { paramsTuple?: []; params?: {} }
    'wallets.store': { paramsTuple?: []; params?: {} }
    'wallets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallets.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallets.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'auth.profile': { paramsTuple?: []; params?: {} }
    'transaction_analytics.index': { paramsTuple?: []; params?: {} }
    'contacts.index': { paramsTuple?: []; params?: {} }
    'contacts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expense_categories.index': { paramsTuple?: []; params?: {} }
    'expense_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expenses.index': { paramsTuple?: []; params?: {} }
    'expenses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'income_categories.index': { paramsTuple?: []; params?: {} }
    'income_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal_transfers.index': { paramsTuple?: []; params?: {} }
    'internal_transfers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.index': { paramsTuple?: []; params?: {} }
    'incomes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet_types.index': { paramsTuple?: []; params?: {} }
    'wallet_types.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallets.index': { paramsTuple?: []; params?: {} }
    'wallets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'auth.profile': { paramsTuple?: []; params?: {} }
    'transaction_analytics.index': { paramsTuple?: []; params?: {} }
    'contacts.index': { paramsTuple?: []; params?: {} }
    'contacts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expense_categories.index': { paramsTuple?: []; params?: {} }
    'expense_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expenses.index': { paramsTuple?: []; params?: {} }
    'expenses.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'income_categories.index': { paramsTuple?: []; params?: {} }
    'income_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal_transfers.index': { paramsTuple?: []; params?: {} }
    'internal_transfers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.index': { paramsTuple?: []; params?: {} }
    'incomes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet_types.index': { paramsTuple?: []; params?: {} }
    'wallet_types.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallets.index': { paramsTuple?: []; params?: {} }
    'wallets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.sign_up': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple?: []; params?: {} }
    'auth.sign_in': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.delete_account': { paramsTuple?: []; params?: {} }
    'contacts.create_mass': { paramsTuple?: []; params?: {} }
    'contacts.delete_mass': { paramsTuple?: []; params?: {} }
    'expense_categories.create_mass': { paramsTuple?: []; params?: {} }
    'expense_categories.delete_mass': { paramsTuple?: []; params?: {} }
    'expenses.create_mass': { paramsTuple?: []; params?: {} }
    'expenses.delete_mass': { paramsTuple?: []; params?: {} }
    'internal_transfers.create_mass': { paramsTuple?: []; params?: {} }
    'internal_transfers.delete_mass': { paramsTuple?: []; params?: {} }
    'income_categories.create_mass': { paramsTuple?: []; params?: {} }
    'income_categories.delete_mass': { paramsTuple?: []; params?: {} }
    'incomes.create_mass': { paramsTuple?: []; params?: {} }
    'incomes.delete_mass': { paramsTuple?: []; params?: {} }
    'wallet_types.create_mass': { paramsTuple?: []; params?: {} }
    'wallet_types.delete_mass': { paramsTuple?: []; params?: {} }
    'wallets.create_mass': { paramsTuple?: []; params?: {} }
    'wallets.delete_mass': { paramsTuple?: []; params?: {} }
    'contacts.store': { paramsTuple?: []; params?: {} }
    'expense_categories.store': { paramsTuple?: []; params?: {} }
    'expenses.store': { paramsTuple?: []; params?: {} }
    'income_categories.store': { paramsTuple?: []; params?: {} }
    'internal_transfers.store': { paramsTuple?: []; params?: {} }
    'incomes.store': { paramsTuple?: []; params?: {} }
    'wallet_types.store': { paramsTuple?: []; params?: {} }
    'wallets.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'auth.update_profile': { paramsTuple?: []; params?: {} }
    'contacts.update_mass': { paramsTuple?: []; params?: {} }
    'expense_categories.update_mass': { paramsTuple?: []; params?: {} }
    'expenses.update_mass': { paramsTuple?: []; params?: {} }
    'internal_transfers.update_mass': { paramsTuple?: []; params?: {} }
    'income_categories.update_mass': { paramsTuple?: []; params?: {} }
    'incomes.update_mass': { paramsTuple?: []; params?: {} }
    'wallet_types.update_mass': { paramsTuple?: []; params?: {} }
    'wallets.update_mass': { paramsTuple?: []; params?: {} }
    'contacts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expense_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expenses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'income_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal_transfers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallets.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'contacts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expense_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expenses.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'income_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal_transfers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallets.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'contacts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expense_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'expenses.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'income_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'internal_transfers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallet_types.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'wallets.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}