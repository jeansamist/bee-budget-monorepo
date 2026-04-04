import Contact from '#models/contact'
import Expense from '#models/expense'
import ExpenseCategory from '#models/expense_category'
import User from '#models/user'
import Wallet from '#models/wallet'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class ExpenseSeeder extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'demo@beebudget.app')

    const existing = await Expense.query().where('user_id', user.id).count('* as total')
    if (Number(existing[0].$extras.total) > 0) return

    const [wallets, categories, contacts] = await Promise.all([
      Wallet.query().where('user_id', user.id),
      ExpenseCategory.query().where('user_id', user.id),
      Contact.query().where('user_id', user.id),
    ])

    const w = (name: string) => wallets.find((x) => x.name === name)!
    const cat = (name: string) => categories.find((x) => x.name === name)!
    const contact = (name: string) => contacts.find((x) => x.name === name)!

    const orangeMoney = w('ORANGE_MONEY')
    const mtnMomo = w('MTN_MOMO')
    const physical = w('PHYSICAL')

    const now = DateTime.now()

    type ExpenseRow = {
      name: string
      description: string
      amount: number
      fees: number | null
      expenseCategoryId: number
      walletId: number
      toContactId: number | null
      userId: number
      date: DateTime
    }

    const expenses: ExpenseRow[] = [
      {
        name: 'Courses hebdomadaires',
        description: 'Marché et supermarché',
        amount: 21_500,
        fees: null,
        expenseCategoryId: cat('GROCERIES').id,
        walletId: physical.id,
        toContactId: contact('Marie Dubois').id,
        userId: user.id,
        date: now.minus({ days: 2 }),
      },
      {
        name: 'Carburant',
        description: 'Plein pour déplacements client',
        amount: 28_000,
        fees: 500,
        expenseCategoryId: cat('TRANSPORT').id,
        walletId: orangeMoney.id,
        toContactId: contact('Thomas Martin').id,
        userId: user.id,
        date: now.minus({ days: 4 }),
      },
      {
        name: 'Facture électricité',
        description: 'Paiement ENEO du mois',
        amount: 41_000,
        fees: 1_000,
        expenseCategoryId: cat('UTILITIES').id,
        walletId: mtnMomo.id,
        toContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ days: 8 }),
      },
      {
        name: 'Abonnement internet',
        description: 'Connexion fibre bureau',
        amount: 25_000,
        fees: 500,
        expenseCategoryId: cat('UTILITIES').id,
        walletId: orangeMoney.id,
        toContactId: contact('StartupHub').id,
        userId: user.id,
        date: now.minus({ days: 12 }),
      },
      {
        name: 'Taxi rendez-vous',
        description: 'Déplacement centre-ville',
        amount: 6_500,
        fees: null,
        expenseCategoryId: cat('TRANSPORT').id,
        walletId: physical.id,
        toContactId: contact('Lucas Petit').id,
        userId: user.id,
        date: now.minus({ days: 15 }),
      },
      {
        name: 'Déjeuner équipe',
        description: 'Repas après atelier produit',
        amount: 18_000,
        fees: 1_000,
        expenseCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        toContactId: contact('Julie Simon').id,
        userId: user.id,
        date: now.minus({ days: 20 }),
      },
      {
        name: 'Courses mensuelles',
        description: 'Réserve de produits maison',
        amount: 38_000,
        fees: null,
        expenseCategoryId: cat('GROCERIES').id,
        walletId: physical.id,
        toContactId: contact('Emma Leroy').id,
        userId: user.id,
        date: now.minus({ months: 1, days: 3 }),
      },
      {
        name: 'Réparation moto',
        description: 'Entretien et pièces',
        amount: 45_000,
        fees: 2_000,
        expenseCategoryId: cat('TRANSPORT').id,
        walletId: mtnMomo.id,
        toContactId: contact('Alexandre Morel').id,
        userId: user.id,
        date: now.minus({ months: 1, days: 9 }),
      },
      {
        name: 'Eau et entretien',
        description: 'Facture CAMWATER',
        amount: 13_500,
        fees: 500,
        expenseCategoryId: cat('UTILITIES').id,
        walletId: orangeMoney.id,
        toContactId: contact('Association Sportive').id,
        userId: user.id,
        date: now.minus({ months: 1, days: 15 }),
      },
      {
        name: 'Courses express',
        description: 'Dépenses de fin de semaine',
        amount: 8_000,
        fees: null,
        expenseCategoryId: cat('GROCERIES').id,
        walletId: physical.id,
        toContactId: contact('Sophie Bernard').id,
        userId: user.id,
        date: now.minus({ months: 2, days: 1 }),
      },
      {
        name: 'Frais administratifs',
        description: 'Paiement documents et impressions',
        amount: 9_000,
        fees: 1_500,
        expenseCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        toContactId: contact('ConsultPro').id,
        userId: user.id,
        date: now.minus({ months: 2, days: 11 }),
      },
      {
        name: 'Recharge compteur',
        description: 'Crédit énergie prépayée',
        amount: 30_000,
        fees: 500,
        expenseCategoryId: cat('UTILITIES').id,
        walletId: mtnMomo.id,
        toContactId: contact('MediaGroup SA').id,
        userId: user.id,
        date: now.minus({ months: 2, days: 19 }),
      },
    ]

    const walletTotals = new Map<number, number>()
    for (const expense of expenses) {
      const nextTotal = expense.amount + (expense.fees ?? 0)
      walletTotals.set(expense.walletId, (walletTotals.get(expense.walletId) ?? 0) + nextTotal)
      await Expense.create(expense)
    }

    for (const [walletId, total] of walletTotals) {
      const wallet = wallets.find((item) => item.id === walletId)
      if (!wallet) continue
      if (wallet.amount < total) {
        throw new Error(`Expense seed exceeds wallet balance for wallet ${wallet.name}`)
      }
      await Wallet.query()
        .where('id', walletId)
        .update({ amount: wallet.amount - total })
    }
  }
}
