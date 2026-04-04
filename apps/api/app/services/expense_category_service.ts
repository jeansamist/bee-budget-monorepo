import { ExpenseCategorySchema } from '#database/schema'
import ContactRepository from '#repositories/contact_repository'
import ExpenseCategoryRepository from '#repositories/expense_category_repository'
import WalletTypeRepository from '#repositories/wallet_type_repository'
import { INTERNAL_TRANSFER_EXPENSE_CATEGORY_NAME } from '#utils/internal_transfer'
import { httpError } from '#utils/http_error'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type CreateExpenseCategoryPayload = {
  name: string
  icon?: string | null
  color: string
  defaultWalletTypeId?: number | null
  defaultContactId?: number | null
}

type UpdateExpenseCategoryPayload = Partial<{
  name: string
  icon: string | null
  color: string
  defaultWalletTypeId: number | null
  defaultContactId: number | null
}>

type MassUpdateExpenseCategoryPayload = UpdateExpenseCategoryPayload & { id: number }

@inject()
export class ExpenseCategoryService {
  constructor(
    private readonly repository: ExpenseCategoryRepository,
    private readonly walletTypeRepository: WalletTypeRepository,
    private readonly contactRepository: ContactRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  checkOwnership(expenseCategory: ExpenseCategorySchema) {
    if (expenseCategory.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this expense category')
    }
  }

  private ensureExpenseCategoryIsEditable(expenseCategory: ExpenseCategorySchema) {
    if (expenseCategory.isSystem) {
      throw httpError(422, 'System expense categories cannot be modified')
    }
  }

  private ensureExpenseCategoryNameIsAllowed(name: string | undefined) {
    if (name === undefined) return
    if (name === INTERNAL_TRANSFER_EXPENSE_CATEGORY_NAME) {
      throw httpError(422, 'This expense category name is reserved')
    }
  }

  private async validateDefaultWalletType(defaultWalletTypeId: number | null | undefined) {
    if (defaultWalletTypeId === undefined || defaultWalletTypeId === null) {
      return
    }

    const walletType = await this.walletTypeRepository.findById(defaultWalletTypeId)
    if (walletType.userId !== this.userId) {
      throw httpError(422, 'The selected default wallet type is invalid')
    }
  }

  private async validateDefaultContact(defaultContactId: number | null | undefined) {
    if (defaultContactId === undefined || defaultContactId === null) return
    const contact = await this.contactRepository.findById(defaultContactId)
    if (contact.userId !== this.userId) {
      throw httpError(422, 'The selected default contact is invalid')
    }
  }

  async createExpenseCategory(data: CreateExpenseCategoryPayload) {
    this.ensureExpenseCategoryNameIsAllowed(data.name)
    await this.validateDefaultWalletType(data.defaultWalletTypeId)
    await this.validateDefaultContact(data.defaultContactId)

    return this.repository.create({
      ...data,
      icon: data.icon ?? null,
      defaultWalletTypeId: data.defaultWalletTypeId ?? null,
      defaultContactId: data.defaultContactId ?? null,
      isSystem: false,
      userId: this.userId,
    })
  }

  async updateExpenseCategory(id: number, data: UpdateExpenseCategoryPayload) {
    const expenseCategory = await this.repository.findById(id)
    this.checkOwnership(expenseCategory)
    this.ensureExpenseCategoryIsEditable(expenseCategory)
    this.ensureExpenseCategoryNameIsAllowed(data.name)
    await this.validateDefaultWalletType(data.defaultWalletTypeId)
    await this.validateDefaultContact(data.defaultContactId)
    return this.repository.update(expenseCategory, data)
  }

  async deleteExpenseCategory(id: number) {
    const expenseCategory = await this.repository.findById(id)
    this.checkOwnership(expenseCategory)
    this.ensureExpenseCategoryIsEditable(expenseCategory)
    return this.repository.delete(expenseCategory)
  }

  async getExpenseCategoryById(id: number) {
    const expenseCategory = await this.repository.findById(id)
    this.checkOwnership(expenseCategory)
    return expenseCategory
  }

  async getAllUserExpenseCategories() {
    return this.repository.findAllByUserId(this.userId)
  }

  async getPaginatedUserExpenseCategories(page: number, perPage: number) {
    return this.repository.paginateByUserId(this.userId, page, perPage)
  }

  async createMassExpenseCategories(items: CreateExpenseCategoryPayload[]) {
    const expenseCategories = []
    for (const item of items) {
      expenseCategories.push(await this.createExpenseCategory(item))
    }
    return expenseCategories
  }

  async updateMassExpenseCategories(items: MassUpdateExpenseCategoryPayload[]) {
    const expenseCategories = []
    for (const item of items) {
      const { id, ...data } = item
      expenseCategories.push(await this.updateExpenseCategory(id, data))
    }
    return expenseCategories
  }

  async deleteMassExpenseCategories(ids: number[]) {
    for (const id of ids) {
      await this.deleteExpenseCategory(id)
    }
  }
}
