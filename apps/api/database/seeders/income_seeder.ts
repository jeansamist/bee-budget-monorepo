import Contact from '#models/contact'
import Expense from '#models/expense'
import Income from '#models/income'
import IncomeCategory from '#models/income_category'
import User from '#models/user'
import Wallet from '#models/wallet'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class IncomeSeeder extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'demo@beebudget.app')

    const [wallets, categories, contacts] = await Promise.all([
      Wallet.query().where('user_id', user.id),
      IncomeCategory.query().where('user_id', user.id),
      Contact.query().where('user_id', user.id),
    ])

    const w = (name: string) => wallets.find((x) => x.name === name)!
    const cat = (name: string) => categories.find((x) => x.name === name)!
    const contact = (name: string) => contacts.find((x) => x.name === name)!

    const orangeMoney = w('ORANGE_MONEY')
    const mtnMomo = w('MTN_MOMO')
    const physical = w('PHYSICAL')

    const now = DateTime.now()

    type IncomeRow = {
      name: string
      description: string
      amount: number
      incomeCategoryId: number
      walletId: number
      fromContactId: number | null
      userId: number
      date: DateTime
    }

    const incomes: IncomeRow[] = [
      // --- SALARY (12 months) — paid to ORANGE_MONEY ---
      {
        name: 'Salaire Octobre',
        description: 'Salaire mensuel octobre',
        amount: 350_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 0 }).startOf('month'),
      },
      {
        name: 'Salaire Septembre',
        description: 'Salaire mensuel septembre',
        amount: 350_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 1 }).startOf('month'),
      },
      {
        name: 'Salaire Août',
        description: 'Salaire mensuel août',
        amount: 350_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 2 }).startOf('month'),
      },
      {
        name: 'Salaire Juillet',
        description: 'Salaire mensuel juillet',
        amount: 375_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 3 }).startOf('month'),
      },
      {
        name: 'Salaire Juin',
        description: 'Salaire mensuel juin',
        amount: 375_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 4 }).startOf('month'),
      },
      {
        name: 'Salaire Mai',
        description: 'Salaire mensuel mai',
        amount: 350_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 5 }).startOf('month'),
      },
      {
        name: 'Salaire Avril',
        description: 'Salaire mensuel avril',
        amount: 350_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 6 }).startOf('month'),
      },
      {
        name: 'Salaire Mars',
        description: 'Salaire mensuel mars',
        amount: 350_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 7 }).startOf('month'),
      },
      {
        name: 'Salaire Février',
        description: 'Salaire mensuel février',
        amount: 325_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 8 }).startOf('month'),
      },
      {
        name: 'Salaire Janvier',
        description: 'Salaire mensuel janvier',
        amount: 325_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 9 }).startOf('month'),
      },
      {
        name: 'Salaire Décembre',
        description: 'Salaire mensuel décembre',
        amount: 325_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 10 }).startOf('month'),
      },
      {
        name: 'Salaire Novembre',
        description: 'Salaire mensuel novembre',
        amount: 300_000,
        incomeCategoryId: cat('SALARY').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 11 }).startOf('month'),
      },

      // --- FREELANCE_PAYMENT (12 entries) — paid to MTN_MOMO ---
      {
        name: 'Mission UI/UX',
        description: 'Refonte interface client',
        amount: 150_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('ConsultPro').id,
        userId: user.id,
        date: now.minus({ months: 0, days: 5 }),
      },
      {
        name: 'Développement API',
        description: 'Intégration REST API',
        amount: 280_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('StartupHub').id,
        userId: user.id,
        date: now.minus({ months: 1, days: 3 }),
      },
      {
        name: 'Audit technique',
        description: 'Audit code base client',
        amount: 95_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('InnovateTech').id,
        userId: user.id,
        date: now.minus({ months: 1, days: 15 }),
      },
      {
        name: 'Formation React',
        description: 'Formation équipe développement',
        amount: 120_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('MediaGroup SA').id,
        userId: user.id,
        date: now.minus({ months: 2, days: 8 }),
      },
      {
        name: 'Conseil stratégique',
        description: 'Consulting digital',
        amount: 85_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('ConsultPro').id,
        userId: user.id,
        date: now.minus({ months: 3, days: 2 }),
      },
      {
        name: 'Développement mobile',
        description: 'Application React Native',
        amount: 450_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('StartupHub').id,
        userId: user.id,
        date: now.minus({ months: 3, days: 20 }),
      },
      {
        name: 'Maintenance site',
        description: 'Maintenance mensuelle',
        amount: 45_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('MediaGroup SA').id,
        userId: user.id,
        date: now.minus({ months: 4, days: 10 }),
      },
      {
        name: 'Migration cloud',
        description: 'Migration infrastructure',
        amount: 350_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('InnovateTech').id,
        userId: user.id,
        date: now.minus({ months: 5, days: 7 }),
      },
      {
        name: 'Dashboard analytics',
        description: 'Tableau de bord personnalisé',
        amount: 200_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 6, days: 12 }),
      },
      {
        name: 'Intégration CRM',
        description: 'Intégration Salesforce',
        amount: 260_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('ConsultPro').id,
        userId: user.id,
        date: now.minus({ months: 7, days: 4 }),
      },
      {
        name: 'SEO & Performances',
        description: 'Optimisation SEO site web',
        amount: 75_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('MediaGroup SA').id,
        userId: user.id,
        date: now.minus({ months: 8, days: 18 }),
      },
      {
        name: 'Développement backend',
        description: 'API Node.js microservices',
        amount: 400_000,
        incomeCategoryId: cat('FREELANCE_PAYMENT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('StartupHub').id,
        userId: user.id,
        date: now.minus({ months: 9, days: 9 }),
      },

      // --- OTHER — Revenus Locatifs (10 entries) — paid to ORANGE_MONEY ---
      {
        name: 'Loyer Appartement',
        description: 'Loyer mensuel appartement T3',
        amount: 85_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Nicolas Robert').id,
        userId: user.id,
        date: now.minus({ months: 0, days: 1 }),
      },
      {
        name: 'Loyer Appartement',
        description: 'Loyer mensuel appartement T3',
        amount: 85_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Nicolas Robert').id,
        userId: user.id,
        date: now.minus({ months: 1, days: 1 }),
      },
      {
        name: 'Loyer Appartement',
        description: 'Loyer mensuel appartement T3',
        amount: 85_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Nicolas Robert').id,
        userId: user.id,
        date: now.minus({ months: 2, days: 1 }),
      },
      {
        name: 'Loyer Appartement',
        description: 'Loyer mensuel appartement T3',
        amount: 85_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Nicolas Robert').id,
        userId: user.id,
        date: now.minus({ months: 3, days: 1 }),
      },
      {
        name: 'Loyer Appartement',
        description: 'Loyer mensuel appartement T3',
        amount: 85_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Nicolas Robert').id,
        userId: user.id,
        date: now.minus({ months: 4, days: 1 }),
      },
      {
        name: 'Loyer Appartement',
        description: 'Loyer mensuel appartement T3',
        amount: 80_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Nicolas Robert').id,
        userId: user.id,
        date: now.minus({ months: 5, days: 1 }),
      },
      {
        name: 'Loyer Appartement',
        description: 'Loyer mensuel appartement T3',
        amount: 80_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Nicolas Robert').id,
        userId: user.id,
        date: now.minus({ months: 6, days: 1 }),
      },
      {
        name: 'Loyer Appartement',
        description: 'Loyer mensuel appartement T3',
        amount: 80_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Nicolas Robert').id,
        userId: user.id,
        date: now.minus({ months: 7, days: 1 }),
      },
      {
        name: 'Loyer Appartement',
        description: 'Loyer mensuel appartement T3',
        amount: 80_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Nicolas Robert').id,
        userId: user.id,
        date: now.minus({ months: 8, days: 1 }),
      },
      {
        name: 'Loyer Appartement',
        description: 'Loyer mensuel appartement T3',
        amount: 80_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Nicolas Robert').id,
        userId: user.id,
        date: now.minus({ months: 9, days: 1 }),
      },

      // --- GIFT — Dividendes (8 entries) — paid to MTN_MOMO ---
      {
        name: 'Dividendes Q3',
        description: 'Dividendes trimestriels portefeuille',
        amount: 55_000,
        incomeCategoryId: cat('GIFT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('Club Investisseurs').id,
        userId: user.id,
        date: now.minus({ months: 1 }),
      },
      {
        name: 'Dividendes Q2',
        description: 'Dividendes trimestriels portefeuille',
        amount: 48_000,
        incomeCategoryId: cat('GIFT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('Club Investisseurs').id,
        userId: user.id,
        date: now.minus({ months: 4 }),
      },
      {
        name: 'Dividendes Q1',
        description: 'Dividendes trimestriels portefeuille',
        amount: 42_000,
        incomeCategoryId: cat('GIFT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('Club Investisseurs').id,
        userId: user.id,
        date: now.minus({ months: 7 }),
      },
      {
        name: 'Dividendes Q4 N-1',
        description: 'Dividendes trimestriels portefeuille',
        amount: 38_000,
        incomeCategoryId: cat('GIFT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('Club Investisseurs').id,
        userId: user.id,
        date: now.minus({ months: 10 }),
      },
      {
        name: 'Action TechCorp',
        description: 'Dividende action TechCorp SARL',
        amount: 18_000,
        incomeCategoryId: cat('GIFT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 2 }),
      },
      {
        name: 'Action TechCorp',
        description: 'Dividende action TechCorp SARL',
        amount: 18_000,
        incomeCategoryId: cat('GIFT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 5 }),
      },
      {
        name: 'Action TechCorp',
        description: 'Dividende action TechCorp SARL',
        amount: 16_000,
        incomeCategoryId: cat('GIFT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 8 }),
      },
      {
        name: 'Action TechCorp',
        description: 'Dividende action TechCorp SARL',
        amount: 16_000,
        incomeCategoryId: cat('GIFT').id,
        walletId: mtnMomo.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 11 }),
      },
      {
        name: 'Cadeau familial',
        description: 'Cadeau en especes pour depenses personnelles',
        amount: 50_000,
        incomeCategoryId: cat('GIFT').id,
        walletId: physical.id,
        fromContactId: contact('Sophie Bernard').id,
        userId: user.id,
        date: now.minus({ months: 1, days: 8 }),
      },

      // --- OTHER — Remboursements (8 entries) — paid to PHYSICAL or ORANGE_MONEY ---
      {
        name: 'Remboursement frais pro',
        description: 'Frais déplacement client',
        amount: 15_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 0, days: 10 }),
      },
      {
        name: 'Remboursement repas',
        description: 'Notes de frais repas client',
        amount: 8_500,
        incomeCategoryId: cat('OTHER').id,
        walletId: physical.id,
        fromContactId: contact('Thomas Martin').id,
        userId: user.id,
        date: now.minus({ months: 1, days: 12 }),
      },
      {
        name: 'Remboursement voyage',
        description: 'Billet avion conférence tech',
        amount: 42_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('ConsultPro').id,
        userId: user.id,
        date: now.minus({ months: 2, days: 6 }),
      },
      {
        name: 'Remboursement cotisation',
        description: 'Remboursement cotisation annuelle',
        amount: 6_500,
        incomeCategoryId: cat('OTHER').id,
        walletId: physical.id,
        fromContactId: contact('Association Sportive').id,
        userId: user.id,
        date: now.minus({ months: 3, days: 14 }),
      },
      {
        name: 'Remboursement matériel',
        description: 'Achat matériel informatique',
        amount: 35_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('InnovateTech').id,
        userId: user.id,
        date: now.minus({ months: 4, days: 3 }),
      },
      {
        name: 'Remboursement prêt',
        description: 'Prêt personnel remboursé',
        amount: 25_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('Sophie Bernard').id,
        userId: user.id,
        date: now.minus({ months: 5, days: 20 }),
      },
      {
        name: 'Remboursement fournitures',
        description: 'Fournitures bureau partagées',
        amount: 7_500,
        incomeCategoryId: cat('OTHER').id,
        walletId: physical.id,
        fromContactId: contact('Marie Dubois').id,
        userId: user.id,
        date: now.minus({ months: 7, days: 8 }),
      },
      {
        name: 'Remboursement frais pro',
        description: 'Frais déplacement client',
        amount: 12_000,
        incomeCategoryId: cat('OTHER').id,
        walletId: orangeMoney.id,
        fromContactId: contact('TechCorp SARL').id,
        userId: user.id,
        date: now.minus({ months: 9, days: 5 }),
      },
    ]

    const existingIncomes = await Income.query().where('user_id', user.id)
    const existingIncomeKeys = new Set(
      existingIncomes.map((income) =>
        [
          income.name,
          income.amount,
          income.walletId,
          income.fromContactId,
          income.date.toISODate(),
        ].join('|')
      )
    )

    const missingIncomes = incomes.filter((income) => {
      const key = [
        income.name,
        income.amount,
        income.walletId,
        income.fromContactId,
        income.date.toISODate(),
      ].join('|')
      return !existingIncomeKeys.has(key)
    })

    for (const income of missingIncomes) {
      await Income.create(income)
    }

    const [seededIncomes, seededExpenses] = await Promise.all([
      Income.query().where('user_id', user.id),
      Expense.query().where('user_id', user.id),
    ])

    const incomeTotals = new Map<number, number>()
    seededIncomes.forEach((income) => {
      if (income.walletId === null) return
      incomeTotals.set(income.walletId, (incomeTotals.get(income.walletId) ?? 0) + income.amount)
    })

    const expenseTotals = new Map<number, number>()
    seededExpenses.forEach((expense) => {
      if (expense.walletId === null) return
      expenseTotals.set(
        expense.walletId,
        (expenseTotals.get(expense.walletId) ?? 0) + expense.amount + (expense.fees ?? 0)
      )
    })

    for (const wallet of wallets) {
      await Wallet.query()
        .where('id', wallet.id)
        .update({
          amount: (incomeTotals.get(wallet.id) ?? 0) - (expenseTotals.get(wallet.id) ?? 0),
        })
    }
  }
}
