/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.sign_up': {
    methods: ["POST"]
    pattern: '/api/auth/sign-up'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').signUpValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').signUpValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signUp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signUp']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.verify_email': {
    methods: ["POST"]
    pattern: '/api/auth/verify-email'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').verifyEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').verifyEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyEmail']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.sign_in': {
    methods: ["POST"]
    pattern: '/api/auth/sign-in'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').signInValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').signInValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signIn']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signIn']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.forgot_password': {
    methods: ["POST"]
    pattern: '/api/auth/forgot-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').forgotPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').forgotPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['forgotPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['forgotPassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.reset_password': {
    methods: ["POST"]
    pattern: '/api/auth/reset-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').resetPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').resetPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetPassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.logout': {
    methods: ["POST"]
    pattern: '/api/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'auth.delete_account': {
    methods: ["POST"]
    pattern: '/api/auth/delete-account'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['deleteAccount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['deleteAccount']>>>
    }
  }
  'auth.profile': {
    methods: ["GET","HEAD"]
    pattern: '/api/auth/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['profile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['profile']>>>
    }
  }
  'auth.update_profile': {
    methods: ["PUT"]
    pattern: '/api/auth/update-profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['updateProfile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['updateProfile']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contacts.create_mass': {
    methods: ["POST"]
    pattern: '/api/contacts/create-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').createMassContactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').createMassContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['createMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['createMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contacts.update_mass': {
    methods: ["PUT"]
    pattern: '/api/contacts/update-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').updateMassContactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').updateMassContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['updateMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['updateMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contacts.delete_mass': {
    methods: ["POST"]
    pattern: '/api/contacts/delete-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').deleteMassContactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').deleteMassContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['deleteMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['deleteMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expense_categories.create_mass': {
    methods: ["POST"]
    pattern: '/api/expense-categories/create-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expense_category').createMassExpenseCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/expense_category').createMassExpenseCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['createMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['createMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expense_categories.update_mass': {
    methods: ["PUT"]
    pattern: '/api/expense-categories/update-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expense_category').updateMassExpenseCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/expense_category').updateMassExpenseCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['updateMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['updateMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expense_categories.delete_mass': {
    methods: ["POST"]
    pattern: '/api/expense-categories/delete-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expense_category').deleteMassExpenseCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/expense_category').deleteMassExpenseCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['deleteMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['deleteMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expenses.create_mass': {
    methods: ["POST"]
    pattern: '/api/expenses/create-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expense').createMassExpenseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/expense').createMassExpenseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['createMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['createMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expenses.update_mass': {
    methods: ["PUT"]
    pattern: '/api/expenses/update-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expense').updateMassExpenseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/expense').updateMassExpenseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['updateMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['updateMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expenses.delete_mass': {
    methods: ["POST"]
    pattern: '/api/expenses/delete-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expense').deleteMassExpenseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/expense').deleteMassExpenseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['deleteMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['deleteMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'internal_transfers.create_mass': {
    methods: ["POST"]
    pattern: '/api/internal-transfers/create-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/internal_transfer').createMassInternalTransferValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/internal_transfer').createMassInternalTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['createMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['createMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'internal_transfers.update_mass': {
    methods: ["PUT"]
    pattern: '/api/internal-transfers/update-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/internal_transfer').updateMassInternalTransferValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/internal_transfer').updateMassInternalTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['updateMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['updateMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'internal_transfers.delete_mass': {
    methods: ["POST"]
    pattern: '/api/internal-transfers/delete-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/internal_transfer').deleteMassInternalTransferValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/internal_transfer').deleteMassInternalTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['deleteMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['deleteMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transaction_analytics.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/transactions/analytics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/transaction_analytics').transactionAnalyticsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transaction_analytics_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transaction_analytics_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'income_categories.create_mass': {
    methods: ["POST"]
    pattern: '/api/income-categories/create-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/income_category').createMassIncomeCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/income_category').createMassIncomeCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['createMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['createMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'income_categories.update_mass': {
    methods: ["PUT"]
    pattern: '/api/income-categories/update-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/income_category').updateMassIncomeCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/income_category').updateMassIncomeCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['updateMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['updateMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'income_categories.delete_mass': {
    methods: ["POST"]
    pattern: '/api/income-categories/delete-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/income_category').deleteMassIncomeCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/income_category').deleteMassIncomeCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['deleteMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['deleteMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'incomes.create_mass': {
    methods: ["POST"]
    pattern: '/api/incomes/create-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/income').createMassIncomeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/income').createMassIncomeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['createMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['createMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'incomes.update_mass': {
    methods: ["PUT"]
    pattern: '/api/incomes/update-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/income').updateMassIncomeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/income').updateMassIncomeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['updateMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['updateMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'incomes.delete_mass': {
    methods: ["POST"]
    pattern: '/api/incomes/delete-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/income').deleteMassIncomeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/income').deleteMassIncomeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['deleteMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['deleteMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallet_types.create_mass': {
    methods: ["POST"]
    pattern: '/api/wallet-types/create-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wallet_type').createMassWalletTypeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/wallet_type').createMassWalletTypeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['createMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['createMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallet_types.update_mass': {
    methods: ["PUT"]
    pattern: '/api/wallet-types/update-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wallet_type').updateMassWalletTypeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/wallet_type').updateMassWalletTypeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['updateMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['updateMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallet_types.delete_mass': {
    methods: ["POST"]
    pattern: '/api/wallet-types/delete-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wallet_type').deleteMassWalletTypeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/wallet_type').deleteMassWalletTypeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['deleteMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['deleteMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallets.create_mass': {
    methods: ["POST"]
    pattern: '/api/wallets/create-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wallet').createMassWalletValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/wallet').createMassWalletValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['createMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['createMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallets.update_mass': {
    methods: ["PUT"]
    pattern: '/api/wallets/update-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wallet').updateMassWalletValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/wallet').updateMassWalletValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['updateMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['updateMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallets.delete_mass': {
    methods: ["POST"]
    pattern: '/api/wallets/delete-mass'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wallet').deleteMassWalletValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/wallet').deleteMassWalletValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['deleteMass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['deleteMass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contacts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/contacts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/pagination').paginateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contacts.store': {
    methods: ["POST"]
    pattern: '/api/contacts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').createContactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').createContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contacts.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/contacts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['show']>>>
    }
  }
  'contacts.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/contacts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').updateContactValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').updateContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contacts.destroy': {
    methods: ["DELETE"]
    pattern: '/api/contacts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['destroy']>>>
    }
  }
  'expense_categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/expense-categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/pagination').paginateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expense_categories.store': {
    methods: ["POST"]
    pattern: '/api/expense-categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expense_category').createExpenseCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/expense_category').createExpenseCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expense_categories.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/expense-categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['show']>>>
    }
  }
  'expense_categories.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/expense-categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expense_category').updateExpenseCategoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/expense_category').updateExpenseCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expense_categories.destroy': {
    methods: ["DELETE"]
    pattern: '/api/expense-categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expense_categories_controller').default['destroy']>>>
    }
  }
  'expenses.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/expenses'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/pagination').paginateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expenses.store': {
    methods: ["POST"]
    pattern: '/api/expenses'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expense').createExpenseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/expense').createExpenseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expenses.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/expenses/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['show']>>>
    }
  }
  'expenses.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/expenses/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expense').updateExpenseValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/expense').updateExpenseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'expenses.destroy': {
    methods: ["DELETE"]
    pattern: '/api/expenses/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/expenses_controller').default['destroy']>>>
    }
  }
  'income_categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/income-categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/pagination').paginateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'income_categories.store': {
    methods: ["POST"]
    pattern: '/api/income-categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/income_category').createIncomeCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/income_category').createIncomeCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'income_categories.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/income-categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['show']>>>
    }
  }
  'income_categories.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/income-categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/income_category').updateIncomeCategoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/income_category').updateIncomeCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'income_categories.destroy': {
    methods: ["DELETE"]
    pattern: '/api/income-categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['destroy']>>>
    }
  }
  'internal_transfers.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/internal-transfers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/pagination').paginateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'internal_transfers.store': {
    methods: ["POST"]
    pattern: '/api/internal-transfers'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/internal_transfer').createInternalTransferValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/internal_transfer').createInternalTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'internal_transfers.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/internal-transfers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['show']>>>
    }
  }
  'internal_transfers.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/internal-transfers/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/internal_transfer').updateInternalTransferValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/internal_transfer').updateInternalTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'internal_transfers.destroy': {
    methods: ["DELETE"]
    pattern: '/api/internal-transfers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/internal_transfers_controller').default['destroy']>>>
    }
  }
  'incomes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/incomes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/pagination').paginateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'incomes.store': {
    methods: ["POST"]
    pattern: '/api/incomes'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/income').createIncomeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/income').createIncomeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'incomes.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/incomes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['show']>>>
    }
  }
  'incomes.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/incomes/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/income').updateIncomeValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/income').updateIncomeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'incomes.destroy': {
    methods: ["DELETE"]
    pattern: '/api/incomes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['destroy']>>>
    }
  }
  'wallet_types.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/wallet-types'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/pagination').paginateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallet_types.store': {
    methods: ["POST"]
    pattern: '/api/wallet-types'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wallet_type').createWalletTypeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/wallet_type').createWalletTypeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallet_types.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/wallet-types/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['show']>>>
    }
  }
  'wallet_types.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/wallet-types/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wallet_type').updateWalletTypeValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/wallet_type').updateWalletTypeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallet_types.destroy': {
    methods: ["DELETE"]
    pattern: '/api/wallet-types/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['destroy']>>>
    }
  }
  'wallets.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/wallets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/pagination').paginateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallets.store': {
    methods: ["POST"]
    pattern: '/api/wallets'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wallet').createWalletValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/wallet').createWalletValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallets.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/wallets/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['show']>>>
    }
  }
  'wallets.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/wallets/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/wallet').updateWalletValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/wallet').updateWalletValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'wallets.destroy': {
    methods: ["DELETE"]
    pattern: '/api/wallets/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['destroy']>>>
    }
  }
}
