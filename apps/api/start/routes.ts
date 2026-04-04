/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.ts'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('/sign-up', [controllers.Auth, 'signUp'])
        router.post('/verify-email', [controllers.Auth, 'verifyEmail'])
        router.post('/sign-in', [controllers.Auth, 'signIn'])
        router.post('/forgot-password', [controllers.Auth, 'forgotPassword'])
        router.post('/reset-password', [controllers.Auth, 'resetPassword'])
        router
          .group(() => {
            router.post('/logout', [controllers.Auth, 'logout'])
            router.post('/delete-account', [controllers.Auth, 'deleteAccount'])
            router.get('/profile', [controllers.Auth, 'profile'])
            router.put('/update-profile', [controllers.Auth, 'updateProfile'])
          })
          .use([middleware.auth()])
      })
      .prefix('/auth')
    router
      .group(() => {
        router.post('/create-mass', [controllers.Contacts, 'createMass'])
        router.put('/update-mass', [controllers.Contacts, 'updateMass'])
        router.post('/delete-mass', [controllers.Contacts, 'deleteMass'])
      })
      .prefix('/contacts')
      .use([middleware.auth()])
    router
      .group(() => {
        router.post('/create-mass', [controllers.ExpenseCategories, 'createMass'])
        router.put('/update-mass', [controllers.ExpenseCategories, 'updateMass'])
        router.post('/delete-mass', [controllers.ExpenseCategories, 'deleteMass'])
      })
      .prefix('/expense-categories')
      .use([middleware.auth()])
    router
      .group(() => {
        router.post('/create-mass', [controllers.Expenses, 'createMass'])
        router.put('/update-mass', [controllers.Expenses, 'updateMass'])
        router.post('/delete-mass', [controllers.Expenses, 'deleteMass'])
      })
      .prefix('/expenses')
      .use([middleware.auth()])
    router
      .group(() => {
        router.post('/create-mass', [controllers.InternalTransfers, 'createMass'])
        router.put('/update-mass', [controllers.InternalTransfers, 'updateMass'])
        router.post('/delete-mass', [controllers.InternalTransfers, 'deleteMass'])
      })
      .prefix('/internal-transfers')
      .use([middleware.auth()])
    router
      .get('/transactions/analytics', [controllers.TransactionAnalytics, 'index'])
      .use([middleware.auth()])
    router
      .get('/wallets/:id/analytics', [controllers.WalletAnalytics, 'index'])
      .use([middleware.auth()])
    router
      .group(() => {
        router.post('/create-mass', [controllers.IncomeCategories, 'createMass'])
        router.put('/update-mass', [controllers.IncomeCategories, 'updateMass'])
        router.post('/delete-mass', [controllers.IncomeCategories, 'deleteMass'])
      })
      .prefix('/income-categories')
      .use([middleware.auth()])
    router
      .group(() => {
        router.post('/create-mass', [controllers.Incomes, 'createMass'])
        router.put('/update-mass', [controllers.Incomes, 'updateMass'])
        router.post('/delete-mass', [controllers.Incomes, 'deleteMass'])
      })
      .prefix('/incomes')
      .use([middleware.auth()])
    router
      .group(() => {
        router.post('/create-mass', [controllers.WalletTypes, 'createMass'])
        router.put('/update-mass', [controllers.WalletTypes, 'updateMass'])
        router.post('/delete-mass', [controllers.WalletTypes, 'deleteMass'])
      })
      .prefix('/wallet-types')
      .use([middleware.auth()])
    router
      .group(() => {
        router.post('/create-mass', [controllers.Wallets, 'createMass'])
        router.put('/update-mass', [controllers.Wallets, 'updateMass'])
        router.post('/delete-mass', [controllers.Wallets, 'deleteMass'])
      })
      .prefix('/wallets')
      .use([middleware.auth()])
    router.resource('/contacts', controllers.Contacts).apiOnly().use('*', [middleware.auth()])
    router
      .resource('/expense-categories', controllers.ExpenseCategories)
      .apiOnly()
      .use('*', [middleware.auth()])
    router.resource('/expenses', controllers.Expenses).apiOnly().use('*', [middleware.auth()])
    router
      .resource('/income-categories', controllers.IncomeCategories)
      .apiOnly()
      .use('*', [middleware.auth()])
    router
      .resource('/internal-transfers', controllers.InternalTransfers)
      .apiOnly()
      .use('*', [middleware.auth()])
    router.resource('/incomes', controllers.Incomes).apiOnly().use('*', [middleware.auth()])
    router
      .resource('/wallet-types', controllers.WalletTypes)
      .apiOnly()
      .use('*', [middleware.auth()])
    router.resource('/wallets', controllers.Wallets).apiOnly().use('*', [middleware.auth()])
  })
  .prefix('/api')
