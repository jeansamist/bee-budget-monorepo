import Budget, { type BudgetPeriod, type BudgetTargetType } from '#models/budget'
import ExpenseCategory from '#models/expense_category'
import Wallet from '#models/wallet'
import BudgetRepository from '#repositories/budget_repository'
import { httpError } from '#utils/http_error'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

type CreateBudgetPayload = {
  name: string
  targetType: BudgetTargetType
  expenseCategoryId?: number | null
  walletId?: number | null
  amount: number
  period: BudgetPeriod
  alertThreshold?: number
}

type UpdateBudgetPayload = Partial<CreateBudgetPayload>

@inject()
export class BudgetService {
  constructor(
    private readonly repository: BudgetRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  checkOwnership(budget: Budget) {
    if (budget.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this budget')
    }
  }

  /**
   * Keeps only the id matching the target type and checks it belongs to the user.
   */
  private async resolveTarget(
    targetType: BudgetTargetType,
    expenseCategoryId?: number | null,
    walletId?: number | null
  ) {
    if (targetType === 'expense_category') {
      if (!expenseCategoryId) throw httpError(422, 'Choose an expense category for this budget')
      const category = await ExpenseCategory.find(expenseCategoryId)
      if (!category || category.userId !== this.userId) {
        throw httpError(404, 'Expense category not found')
      }
      if (category.isSystem) {
        throw httpError(422, 'System categories can not have a budget')
      }
      return { expenseCategoryId, walletId: null }
    }

    if (!walletId) throw httpError(422, 'Choose a wallet for this budget')
    const wallet = await Wallet.find(walletId)
    if (!wallet || wallet.userId !== this.userId) {
      throw httpError(404, 'Wallet not found')
    }
    return { expenseCategoryId: null, walletId }
  }

  /**
   * Expenses (fees included) in the budget's current period. Transfers between
   * wallets are moves, not spending, so they are left out.
   */
  async computeSpent(budget: Budget) {
    const { start, end } = budget.periodRange()
    const query = db
      .from('expenses')
      .where('user_id', budget.userId)
      .whereNull('internal_transfer_id')
      .whereBetween('date', [start.toSQL()!, end.toSQL()!])
      .sum(db.raw('amount + coalesce(fees, 0)'), 'total')

    if (budget.targetType === 'expense_category') {
      query.where('expense_category_id', budget.expenseCategoryId!)
    } else {
      query.where('wallet_id', budget.walletId!)
    }

    const [row] = await query
    return budget.setSpent(Number(row?.total ?? 0))
  }

  private async withSpent(budgets: Budget[]) {
    return Promise.all(budgets.map((budget) => this.computeSpent(budget)))
  }

  async createBudget(data: CreateBudgetPayload) {
    const target = await this.resolveTarget(data.targetType, data.expenseCategoryId, data.walletId)
    const budget = await this.repository.create({
      name: data.name,
      targetType: data.targetType,
      amount: data.amount,
      period: data.period,
      alertThreshold: data.alertThreshold ?? 80,
      ...target,
      userId: this.userId,
    })
    return this.computeSpent(budget)
  }

  async updateBudget(id: number, data: UpdateBudgetPayload) {
    const budget = await this.repository.findById(id)
    this.checkOwnership(budget)

    const { expenseCategoryId, walletId, ...rest } = data
    const targetType = data.targetType ?? (budget.targetType as BudgetTargetType)
    const target = await this.resolveTarget(
      targetType,
      expenseCategoryId === undefined ? budget.expenseCategoryId : expenseCategoryId,
      walletId === undefined ? budget.walletId : walletId
    )

    const updated = await this.repository.update(budget, { ...rest, targetType, ...target })
    return this.computeSpent(updated)
  }

  async deleteBudget(id: number) {
    const budget = await this.repository.findById(id)
    this.checkOwnership(budget)
    return this.repository.delete(budget)
  }

  async getBudgetById(id: number) {
    const budget = await this.repository.findById(id)
    this.checkOwnership(budget)
    return this.computeSpent(budget)
  }

  async getPaginatedUserBudgets(page: number, perPage: number) {
    const paginator = await this.repository.paginateByUserId(this.userId, page, perPage)
    await this.withSpent(paginator.all())
    return paginator
  }

  async deleteMassBudgets(ids: number[]) {
    for (const id of ids) {
      await this.deleteBudget(id)
    }
  }
}
