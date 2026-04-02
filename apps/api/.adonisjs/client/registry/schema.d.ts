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
  'income_categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/income-categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/income_categories_controller').default['index']>>>
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
  'incomes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/incomes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/incomes_controller').default['index']>>>
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
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallet_types_controller').default['index']>>>
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
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/wallets_controller').default['index']>>>
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
