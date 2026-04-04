/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.sign_up': {
    methods: ["POST"],
    pattern: '/api/auth/sign-up',
    tokens: [{"old":"/api/auth/sign-up","type":0,"val":"api","end":""},{"old":"/api/auth/sign-up","type":0,"val":"auth","end":""},{"old":"/api/auth/sign-up","type":0,"val":"sign-up","end":""}],
    types: placeholder as Registry['auth.sign_up']['types'],
  },
  'auth.verify_email': {
    methods: ["POST"],
    pattern: '/api/auth/verify-email',
    tokens: [{"old":"/api/auth/verify-email","type":0,"val":"api","end":""},{"old":"/api/auth/verify-email","type":0,"val":"auth","end":""},{"old":"/api/auth/verify-email","type":0,"val":"verify-email","end":""}],
    types: placeholder as Registry['auth.verify_email']['types'],
  },
  'auth.sign_in': {
    methods: ["POST"],
    pattern: '/api/auth/sign-in',
    tokens: [{"old":"/api/auth/sign-in","type":0,"val":"api","end":""},{"old":"/api/auth/sign-in","type":0,"val":"auth","end":""},{"old":"/api/auth/sign-in","type":0,"val":"sign-in","end":""}],
    types: placeholder as Registry['auth.sign_in']['types'],
  },
  'auth.forgot_password': {
    methods: ["POST"],
    pattern: '/api/auth/forgot-password',
    tokens: [{"old":"/api/auth/forgot-password","type":0,"val":"api","end":""},{"old":"/api/auth/forgot-password","type":0,"val":"auth","end":""},{"old":"/api/auth/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['auth.forgot_password']['types'],
  },
  'auth.reset_password': {
    methods: ["POST"],
    pattern: '/api/auth/reset-password',
    tokens: [{"old":"/api/auth/reset-password","type":0,"val":"api","end":""},{"old":"/api/auth/reset-password","type":0,"val":"auth","end":""},{"old":"/api/auth/reset-password","type":0,"val":"reset-password","end":""}],
    types: placeholder as Registry['auth.reset_password']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/auth/logout',
    tokens: [{"old":"/api/auth/logout","type":0,"val":"api","end":""},{"old":"/api/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'auth.delete_account': {
    methods: ["POST"],
    pattern: '/api/auth/delete-account',
    tokens: [{"old":"/api/auth/delete-account","type":0,"val":"api","end":""},{"old":"/api/auth/delete-account","type":0,"val":"auth","end":""},{"old":"/api/auth/delete-account","type":0,"val":"delete-account","end":""}],
    types: placeholder as Registry['auth.delete_account']['types'],
  },
  'auth.profile': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/profile',
    tokens: [{"old":"/api/auth/profile","type":0,"val":"api","end":""},{"old":"/api/auth/profile","type":0,"val":"auth","end":""},{"old":"/api/auth/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['auth.profile']['types'],
  },
  'auth.update_profile': {
    methods: ["PUT"],
    pattern: '/api/auth/update-profile',
    tokens: [{"old":"/api/auth/update-profile","type":0,"val":"api","end":""},{"old":"/api/auth/update-profile","type":0,"val":"auth","end":""},{"old":"/api/auth/update-profile","type":0,"val":"update-profile","end":""}],
    types: placeholder as Registry['auth.update_profile']['types'],
  },
  'contacts.create_mass': {
    methods: ["POST"],
    pattern: '/api/contacts/create-mass',
    tokens: [{"old":"/api/contacts/create-mass","type":0,"val":"api","end":""},{"old":"/api/contacts/create-mass","type":0,"val":"contacts","end":""},{"old":"/api/contacts/create-mass","type":0,"val":"create-mass","end":""}],
    types: placeholder as Registry['contacts.create_mass']['types'],
  },
  'contacts.update_mass': {
    methods: ["PUT"],
    pattern: '/api/contacts/update-mass',
    tokens: [{"old":"/api/contacts/update-mass","type":0,"val":"api","end":""},{"old":"/api/contacts/update-mass","type":0,"val":"contacts","end":""},{"old":"/api/contacts/update-mass","type":0,"val":"update-mass","end":""}],
    types: placeholder as Registry['contacts.update_mass']['types'],
  },
  'contacts.delete_mass': {
    methods: ["POST"],
    pattern: '/api/contacts/delete-mass',
    tokens: [{"old":"/api/contacts/delete-mass","type":0,"val":"api","end":""},{"old":"/api/contacts/delete-mass","type":0,"val":"contacts","end":""},{"old":"/api/contacts/delete-mass","type":0,"val":"delete-mass","end":""}],
    types: placeholder as Registry['contacts.delete_mass']['types'],
  },
  'expense_categories.create_mass': {
    methods: ["POST"],
    pattern: '/api/expense-categories/create-mass',
    tokens: [{"old":"/api/expense-categories/create-mass","type":0,"val":"api","end":""},{"old":"/api/expense-categories/create-mass","type":0,"val":"expense-categories","end":""},{"old":"/api/expense-categories/create-mass","type":0,"val":"create-mass","end":""}],
    types: placeholder as Registry['expense_categories.create_mass']['types'],
  },
  'expense_categories.update_mass': {
    methods: ["PUT"],
    pattern: '/api/expense-categories/update-mass',
    tokens: [{"old":"/api/expense-categories/update-mass","type":0,"val":"api","end":""},{"old":"/api/expense-categories/update-mass","type":0,"val":"expense-categories","end":""},{"old":"/api/expense-categories/update-mass","type":0,"val":"update-mass","end":""}],
    types: placeholder as Registry['expense_categories.update_mass']['types'],
  },
  'expense_categories.delete_mass': {
    methods: ["POST"],
    pattern: '/api/expense-categories/delete-mass',
    tokens: [{"old":"/api/expense-categories/delete-mass","type":0,"val":"api","end":""},{"old":"/api/expense-categories/delete-mass","type":0,"val":"expense-categories","end":""},{"old":"/api/expense-categories/delete-mass","type":0,"val":"delete-mass","end":""}],
    types: placeholder as Registry['expense_categories.delete_mass']['types'],
  },
  'expenses.create_mass': {
    methods: ["POST"],
    pattern: '/api/expenses/create-mass',
    tokens: [{"old":"/api/expenses/create-mass","type":0,"val":"api","end":""},{"old":"/api/expenses/create-mass","type":0,"val":"expenses","end":""},{"old":"/api/expenses/create-mass","type":0,"val":"create-mass","end":""}],
    types: placeholder as Registry['expenses.create_mass']['types'],
  },
  'expenses.update_mass': {
    methods: ["PUT"],
    pattern: '/api/expenses/update-mass',
    tokens: [{"old":"/api/expenses/update-mass","type":0,"val":"api","end":""},{"old":"/api/expenses/update-mass","type":0,"val":"expenses","end":""},{"old":"/api/expenses/update-mass","type":0,"val":"update-mass","end":""}],
    types: placeholder as Registry['expenses.update_mass']['types'],
  },
  'expenses.delete_mass': {
    methods: ["POST"],
    pattern: '/api/expenses/delete-mass',
    tokens: [{"old":"/api/expenses/delete-mass","type":0,"val":"api","end":""},{"old":"/api/expenses/delete-mass","type":0,"val":"expenses","end":""},{"old":"/api/expenses/delete-mass","type":0,"val":"delete-mass","end":""}],
    types: placeholder as Registry['expenses.delete_mass']['types'],
  },
  'internal_transfers.create_mass': {
    methods: ["POST"],
    pattern: '/api/internal-transfers/create-mass',
    tokens: [{"old":"/api/internal-transfers/create-mass","type":0,"val":"api","end":""},{"old":"/api/internal-transfers/create-mass","type":0,"val":"internal-transfers","end":""},{"old":"/api/internal-transfers/create-mass","type":0,"val":"create-mass","end":""}],
    types: placeholder as Registry['internal_transfers.create_mass']['types'],
  },
  'internal_transfers.update_mass': {
    methods: ["PUT"],
    pattern: '/api/internal-transfers/update-mass',
    tokens: [{"old":"/api/internal-transfers/update-mass","type":0,"val":"api","end":""},{"old":"/api/internal-transfers/update-mass","type":0,"val":"internal-transfers","end":""},{"old":"/api/internal-transfers/update-mass","type":0,"val":"update-mass","end":""}],
    types: placeholder as Registry['internal_transfers.update_mass']['types'],
  },
  'internal_transfers.delete_mass': {
    methods: ["POST"],
    pattern: '/api/internal-transfers/delete-mass',
    tokens: [{"old":"/api/internal-transfers/delete-mass","type":0,"val":"api","end":""},{"old":"/api/internal-transfers/delete-mass","type":0,"val":"internal-transfers","end":""},{"old":"/api/internal-transfers/delete-mass","type":0,"val":"delete-mass","end":""}],
    types: placeholder as Registry['internal_transfers.delete_mass']['types'],
  },
  'transaction_analytics.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/transactions/analytics',
    tokens: [{"old":"/api/transactions/analytics","type":0,"val":"api","end":""},{"old":"/api/transactions/analytics","type":0,"val":"transactions","end":""},{"old":"/api/transactions/analytics","type":0,"val":"analytics","end":""}],
    types: placeholder as Registry['transaction_analytics.index']['types'],
  },
  'wallet_analytics.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/wallets/:id/analytics',
    tokens: [{"old":"/api/wallets/:id/analytics","type":0,"val":"api","end":""},{"old":"/api/wallets/:id/analytics","type":0,"val":"wallets","end":""},{"old":"/api/wallets/:id/analytics","type":1,"val":"id","end":""},{"old":"/api/wallets/:id/analytics","type":0,"val":"analytics","end":""}],
    types: placeholder as Registry['wallet_analytics.index']['types'],
  },
  'income_categories.create_mass': {
    methods: ["POST"],
    pattern: '/api/income-categories/create-mass',
    tokens: [{"old":"/api/income-categories/create-mass","type":0,"val":"api","end":""},{"old":"/api/income-categories/create-mass","type":0,"val":"income-categories","end":""},{"old":"/api/income-categories/create-mass","type":0,"val":"create-mass","end":""}],
    types: placeholder as Registry['income_categories.create_mass']['types'],
  },
  'income_categories.update_mass': {
    methods: ["PUT"],
    pattern: '/api/income-categories/update-mass',
    tokens: [{"old":"/api/income-categories/update-mass","type":0,"val":"api","end":""},{"old":"/api/income-categories/update-mass","type":0,"val":"income-categories","end":""},{"old":"/api/income-categories/update-mass","type":0,"val":"update-mass","end":""}],
    types: placeholder as Registry['income_categories.update_mass']['types'],
  },
  'income_categories.delete_mass': {
    methods: ["POST"],
    pattern: '/api/income-categories/delete-mass',
    tokens: [{"old":"/api/income-categories/delete-mass","type":0,"val":"api","end":""},{"old":"/api/income-categories/delete-mass","type":0,"val":"income-categories","end":""},{"old":"/api/income-categories/delete-mass","type":0,"val":"delete-mass","end":""}],
    types: placeholder as Registry['income_categories.delete_mass']['types'],
  },
  'incomes.create_mass': {
    methods: ["POST"],
    pattern: '/api/incomes/create-mass',
    tokens: [{"old":"/api/incomes/create-mass","type":0,"val":"api","end":""},{"old":"/api/incomes/create-mass","type":0,"val":"incomes","end":""},{"old":"/api/incomes/create-mass","type":0,"val":"create-mass","end":""}],
    types: placeholder as Registry['incomes.create_mass']['types'],
  },
  'incomes.update_mass': {
    methods: ["PUT"],
    pattern: '/api/incomes/update-mass',
    tokens: [{"old":"/api/incomes/update-mass","type":0,"val":"api","end":""},{"old":"/api/incomes/update-mass","type":0,"val":"incomes","end":""},{"old":"/api/incomes/update-mass","type":0,"val":"update-mass","end":""}],
    types: placeholder as Registry['incomes.update_mass']['types'],
  },
  'incomes.delete_mass': {
    methods: ["POST"],
    pattern: '/api/incomes/delete-mass',
    tokens: [{"old":"/api/incomes/delete-mass","type":0,"val":"api","end":""},{"old":"/api/incomes/delete-mass","type":0,"val":"incomes","end":""},{"old":"/api/incomes/delete-mass","type":0,"val":"delete-mass","end":""}],
    types: placeholder as Registry['incomes.delete_mass']['types'],
  },
  'wallet_types.create_mass': {
    methods: ["POST"],
    pattern: '/api/wallet-types/create-mass',
    tokens: [{"old":"/api/wallet-types/create-mass","type":0,"val":"api","end":""},{"old":"/api/wallet-types/create-mass","type":0,"val":"wallet-types","end":""},{"old":"/api/wallet-types/create-mass","type":0,"val":"create-mass","end":""}],
    types: placeholder as Registry['wallet_types.create_mass']['types'],
  },
  'wallet_types.update_mass': {
    methods: ["PUT"],
    pattern: '/api/wallet-types/update-mass',
    tokens: [{"old":"/api/wallet-types/update-mass","type":0,"val":"api","end":""},{"old":"/api/wallet-types/update-mass","type":0,"val":"wallet-types","end":""},{"old":"/api/wallet-types/update-mass","type":0,"val":"update-mass","end":""}],
    types: placeholder as Registry['wallet_types.update_mass']['types'],
  },
  'wallet_types.delete_mass': {
    methods: ["POST"],
    pattern: '/api/wallet-types/delete-mass',
    tokens: [{"old":"/api/wallet-types/delete-mass","type":0,"val":"api","end":""},{"old":"/api/wallet-types/delete-mass","type":0,"val":"wallet-types","end":""},{"old":"/api/wallet-types/delete-mass","type":0,"val":"delete-mass","end":""}],
    types: placeholder as Registry['wallet_types.delete_mass']['types'],
  },
  'wallets.create_mass': {
    methods: ["POST"],
    pattern: '/api/wallets/create-mass',
    tokens: [{"old":"/api/wallets/create-mass","type":0,"val":"api","end":""},{"old":"/api/wallets/create-mass","type":0,"val":"wallets","end":""},{"old":"/api/wallets/create-mass","type":0,"val":"create-mass","end":""}],
    types: placeholder as Registry['wallets.create_mass']['types'],
  },
  'wallets.update_mass': {
    methods: ["PUT"],
    pattern: '/api/wallets/update-mass',
    tokens: [{"old":"/api/wallets/update-mass","type":0,"val":"api","end":""},{"old":"/api/wallets/update-mass","type":0,"val":"wallets","end":""},{"old":"/api/wallets/update-mass","type":0,"val":"update-mass","end":""}],
    types: placeholder as Registry['wallets.update_mass']['types'],
  },
  'wallets.delete_mass': {
    methods: ["POST"],
    pattern: '/api/wallets/delete-mass',
    tokens: [{"old":"/api/wallets/delete-mass","type":0,"val":"api","end":""},{"old":"/api/wallets/delete-mass","type":0,"val":"wallets","end":""},{"old":"/api/wallets/delete-mass","type":0,"val":"delete-mass","end":""}],
    types: placeholder as Registry['wallets.delete_mass']['types'],
  },
  'contacts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/contacts',
    tokens: [{"old":"/api/contacts","type":0,"val":"api","end":""},{"old":"/api/contacts","type":0,"val":"contacts","end":""}],
    types: placeholder as Registry['contacts.index']['types'],
  },
  'contacts.store': {
    methods: ["POST"],
    pattern: '/api/contacts',
    tokens: [{"old":"/api/contacts","type":0,"val":"api","end":""},{"old":"/api/contacts","type":0,"val":"contacts","end":""}],
    types: placeholder as Registry['contacts.store']['types'],
  },
  'contacts.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/contacts/:id',
    tokens: [{"old":"/api/contacts/:id","type":0,"val":"api","end":""},{"old":"/api/contacts/:id","type":0,"val":"contacts","end":""},{"old":"/api/contacts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['contacts.show']['types'],
  },
  'contacts.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/contacts/:id',
    tokens: [{"old":"/api/contacts/:id","type":0,"val":"api","end":""},{"old":"/api/contacts/:id","type":0,"val":"contacts","end":""},{"old":"/api/contacts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['contacts.update']['types'],
  },
  'contacts.destroy': {
    methods: ["DELETE"],
    pattern: '/api/contacts/:id',
    tokens: [{"old":"/api/contacts/:id","type":0,"val":"api","end":""},{"old":"/api/contacts/:id","type":0,"val":"contacts","end":""},{"old":"/api/contacts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['contacts.destroy']['types'],
  },
  'expense_categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/expense-categories',
    tokens: [{"old":"/api/expense-categories","type":0,"val":"api","end":""},{"old":"/api/expense-categories","type":0,"val":"expense-categories","end":""}],
    types: placeholder as Registry['expense_categories.index']['types'],
  },
  'expense_categories.store': {
    methods: ["POST"],
    pattern: '/api/expense-categories',
    tokens: [{"old":"/api/expense-categories","type":0,"val":"api","end":""},{"old":"/api/expense-categories","type":0,"val":"expense-categories","end":""}],
    types: placeholder as Registry['expense_categories.store']['types'],
  },
  'expense_categories.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/expense-categories/:id',
    tokens: [{"old":"/api/expense-categories/:id","type":0,"val":"api","end":""},{"old":"/api/expense-categories/:id","type":0,"val":"expense-categories","end":""},{"old":"/api/expense-categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['expense_categories.show']['types'],
  },
  'expense_categories.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/expense-categories/:id',
    tokens: [{"old":"/api/expense-categories/:id","type":0,"val":"api","end":""},{"old":"/api/expense-categories/:id","type":0,"val":"expense-categories","end":""},{"old":"/api/expense-categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['expense_categories.update']['types'],
  },
  'expense_categories.destroy': {
    methods: ["DELETE"],
    pattern: '/api/expense-categories/:id',
    tokens: [{"old":"/api/expense-categories/:id","type":0,"val":"api","end":""},{"old":"/api/expense-categories/:id","type":0,"val":"expense-categories","end":""},{"old":"/api/expense-categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['expense_categories.destroy']['types'],
  },
  'expenses.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/expenses',
    tokens: [{"old":"/api/expenses","type":0,"val":"api","end":""},{"old":"/api/expenses","type":0,"val":"expenses","end":""}],
    types: placeholder as Registry['expenses.index']['types'],
  },
  'expenses.store': {
    methods: ["POST"],
    pattern: '/api/expenses',
    tokens: [{"old":"/api/expenses","type":0,"val":"api","end":""},{"old":"/api/expenses","type":0,"val":"expenses","end":""}],
    types: placeholder as Registry['expenses.store']['types'],
  },
  'expenses.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/expenses/:id',
    tokens: [{"old":"/api/expenses/:id","type":0,"val":"api","end":""},{"old":"/api/expenses/:id","type":0,"val":"expenses","end":""},{"old":"/api/expenses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['expenses.show']['types'],
  },
  'expenses.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/expenses/:id',
    tokens: [{"old":"/api/expenses/:id","type":0,"val":"api","end":""},{"old":"/api/expenses/:id","type":0,"val":"expenses","end":""},{"old":"/api/expenses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['expenses.update']['types'],
  },
  'expenses.destroy': {
    methods: ["DELETE"],
    pattern: '/api/expenses/:id',
    tokens: [{"old":"/api/expenses/:id","type":0,"val":"api","end":""},{"old":"/api/expenses/:id","type":0,"val":"expenses","end":""},{"old":"/api/expenses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['expenses.destroy']['types'],
  },
  'income_categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/income-categories',
    tokens: [{"old":"/api/income-categories","type":0,"val":"api","end":""},{"old":"/api/income-categories","type":0,"val":"income-categories","end":""}],
    types: placeholder as Registry['income_categories.index']['types'],
  },
  'income_categories.store': {
    methods: ["POST"],
    pattern: '/api/income-categories',
    tokens: [{"old":"/api/income-categories","type":0,"val":"api","end":""},{"old":"/api/income-categories","type":0,"val":"income-categories","end":""}],
    types: placeholder as Registry['income_categories.store']['types'],
  },
  'income_categories.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/income-categories/:id',
    tokens: [{"old":"/api/income-categories/:id","type":0,"val":"api","end":""},{"old":"/api/income-categories/:id","type":0,"val":"income-categories","end":""},{"old":"/api/income-categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['income_categories.show']['types'],
  },
  'income_categories.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/income-categories/:id',
    tokens: [{"old":"/api/income-categories/:id","type":0,"val":"api","end":""},{"old":"/api/income-categories/:id","type":0,"val":"income-categories","end":""},{"old":"/api/income-categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['income_categories.update']['types'],
  },
  'income_categories.destroy': {
    methods: ["DELETE"],
    pattern: '/api/income-categories/:id',
    tokens: [{"old":"/api/income-categories/:id","type":0,"val":"api","end":""},{"old":"/api/income-categories/:id","type":0,"val":"income-categories","end":""},{"old":"/api/income-categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['income_categories.destroy']['types'],
  },
  'internal_transfers.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/internal-transfers',
    tokens: [{"old":"/api/internal-transfers","type":0,"val":"api","end":""},{"old":"/api/internal-transfers","type":0,"val":"internal-transfers","end":""}],
    types: placeholder as Registry['internal_transfers.index']['types'],
  },
  'internal_transfers.store': {
    methods: ["POST"],
    pattern: '/api/internal-transfers',
    tokens: [{"old":"/api/internal-transfers","type":0,"val":"api","end":""},{"old":"/api/internal-transfers","type":0,"val":"internal-transfers","end":""}],
    types: placeholder as Registry['internal_transfers.store']['types'],
  },
  'internal_transfers.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/internal-transfers/:id',
    tokens: [{"old":"/api/internal-transfers/:id","type":0,"val":"api","end":""},{"old":"/api/internal-transfers/:id","type":0,"val":"internal-transfers","end":""},{"old":"/api/internal-transfers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['internal_transfers.show']['types'],
  },
  'internal_transfers.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/internal-transfers/:id',
    tokens: [{"old":"/api/internal-transfers/:id","type":0,"val":"api","end":""},{"old":"/api/internal-transfers/:id","type":0,"val":"internal-transfers","end":""},{"old":"/api/internal-transfers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['internal_transfers.update']['types'],
  },
  'internal_transfers.destroy': {
    methods: ["DELETE"],
    pattern: '/api/internal-transfers/:id',
    tokens: [{"old":"/api/internal-transfers/:id","type":0,"val":"api","end":""},{"old":"/api/internal-transfers/:id","type":0,"val":"internal-transfers","end":""},{"old":"/api/internal-transfers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['internal_transfers.destroy']['types'],
  },
  'incomes.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/incomes',
    tokens: [{"old":"/api/incomes","type":0,"val":"api","end":""},{"old":"/api/incomes","type":0,"val":"incomes","end":""}],
    types: placeholder as Registry['incomes.index']['types'],
  },
  'incomes.store': {
    methods: ["POST"],
    pattern: '/api/incomes',
    tokens: [{"old":"/api/incomes","type":0,"val":"api","end":""},{"old":"/api/incomes","type":0,"val":"incomes","end":""}],
    types: placeholder as Registry['incomes.store']['types'],
  },
  'incomes.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/incomes/:id',
    tokens: [{"old":"/api/incomes/:id","type":0,"val":"api","end":""},{"old":"/api/incomes/:id","type":0,"val":"incomes","end":""},{"old":"/api/incomes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['incomes.show']['types'],
  },
  'incomes.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/incomes/:id',
    tokens: [{"old":"/api/incomes/:id","type":0,"val":"api","end":""},{"old":"/api/incomes/:id","type":0,"val":"incomes","end":""},{"old":"/api/incomes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['incomes.update']['types'],
  },
  'incomes.destroy': {
    methods: ["DELETE"],
    pattern: '/api/incomes/:id',
    tokens: [{"old":"/api/incomes/:id","type":0,"val":"api","end":""},{"old":"/api/incomes/:id","type":0,"val":"incomes","end":""},{"old":"/api/incomes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['incomes.destroy']['types'],
  },
  'wallet_types.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/wallet-types',
    tokens: [{"old":"/api/wallet-types","type":0,"val":"api","end":""},{"old":"/api/wallet-types","type":0,"val":"wallet-types","end":""}],
    types: placeholder as Registry['wallet_types.index']['types'],
  },
  'wallet_types.store': {
    methods: ["POST"],
    pattern: '/api/wallet-types',
    tokens: [{"old":"/api/wallet-types","type":0,"val":"api","end":""},{"old":"/api/wallet-types","type":0,"val":"wallet-types","end":""}],
    types: placeholder as Registry['wallet_types.store']['types'],
  },
  'wallet_types.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/wallet-types/:id',
    tokens: [{"old":"/api/wallet-types/:id","type":0,"val":"api","end":""},{"old":"/api/wallet-types/:id","type":0,"val":"wallet-types","end":""},{"old":"/api/wallet-types/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['wallet_types.show']['types'],
  },
  'wallet_types.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/wallet-types/:id',
    tokens: [{"old":"/api/wallet-types/:id","type":0,"val":"api","end":""},{"old":"/api/wallet-types/:id","type":0,"val":"wallet-types","end":""},{"old":"/api/wallet-types/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['wallet_types.update']['types'],
  },
  'wallet_types.destroy': {
    methods: ["DELETE"],
    pattern: '/api/wallet-types/:id',
    tokens: [{"old":"/api/wallet-types/:id","type":0,"val":"api","end":""},{"old":"/api/wallet-types/:id","type":0,"val":"wallet-types","end":""},{"old":"/api/wallet-types/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['wallet_types.destroy']['types'],
  },
  'wallets.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/wallets',
    tokens: [{"old":"/api/wallets","type":0,"val":"api","end":""},{"old":"/api/wallets","type":0,"val":"wallets","end":""}],
    types: placeholder as Registry['wallets.index']['types'],
  },
  'wallets.store': {
    methods: ["POST"],
    pattern: '/api/wallets',
    tokens: [{"old":"/api/wallets","type":0,"val":"api","end":""},{"old":"/api/wallets","type":0,"val":"wallets","end":""}],
    types: placeholder as Registry['wallets.store']['types'],
  },
  'wallets.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/wallets/:id',
    tokens: [{"old":"/api/wallets/:id","type":0,"val":"api","end":""},{"old":"/api/wallets/:id","type":0,"val":"wallets","end":""},{"old":"/api/wallets/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['wallets.show']['types'],
  },
  'wallets.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/wallets/:id',
    tokens: [{"old":"/api/wallets/:id","type":0,"val":"api","end":""},{"old":"/api/wallets/:id","type":0,"val":"wallets","end":""},{"old":"/api/wallets/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['wallets.update']['types'],
  },
  'wallets.destroy': {
    methods: ["DELETE"],
    pattern: '/api/wallets/:id',
    tokens: [{"old":"/api/wallets/:id","type":0,"val":"api","end":""},{"old":"/api/wallets/:id","type":0,"val":"wallets","end":""},{"old":"/api/wallets/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['wallets.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
