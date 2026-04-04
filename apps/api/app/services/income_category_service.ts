import { IncomeCategorySchema } from '#database/schema'
import IncomeCategoryRepository from '#repositories/income_category_repository'
import ContactRepository from '#repositories/contact_repository'
import WalletTypeRepository from '#repositories/wallet_type_repository'
import { INTERNAL_TRANSFER_INCOME_CATEGORY_NAME } from '#utils/internal_transfer'
import { httpError } from '#utils/http_error'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type CreateIncomeCategoryPayload = {
  name: string
  icon?: string | null
  color: string
  defaultWalletTypeId?: number | null
  defaultContactId?: number | null
}

type UpdateIncomeCategoryPayload = Partial<{
  name: string
  icon: string | null
  color: string
  defaultWalletTypeId: number | null
  defaultContactId: number | null
}>
type MassUpdateIncomeCategoryPayload = UpdateIncomeCategoryPayload & { id: number }

@inject()
export class IncomeCategoryService {
  constructor(
    private readonly repository: IncomeCategoryRepository,
    private readonly walletTypeRepository: WalletTypeRepository,
    private readonly contactRepository: ContactRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  checkOwnership(incomeCategory: IncomeCategorySchema) {
    if (incomeCategory.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this income category')
    }
  }

  private ensureIncomeCategoryIsEditable(incomeCategory: IncomeCategorySchema) {
    if (incomeCategory.isSystem) {
      throw httpError(422, 'System income categories cannot be modified')
    }
  }

  private ensureIncomeCategoryNameIsAllowed(name: string | undefined) {
    if (name === undefined) return
    if (name === INTERNAL_TRANSFER_INCOME_CATEGORY_NAME) {
      throw httpError(422, 'This income category name is reserved')
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

  async createIncomeCategory(data: CreateIncomeCategoryPayload) {
    this.ensureIncomeCategoryNameIsAllowed(data.name)
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
  async updateIncomeCategory(id: number, data: UpdateIncomeCategoryPayload) {
    const incomeCategory = await this.repository.findById(id)
    this.checkOwnership(incomeCategory)
    this.ensureIncomeCategoryIsEditable(incomeCategory)
    this.ensureIncomeCategoryNameIsAllowed(data.name)
    await this.validateDefaultWalletType(data.defaultWalletTypeId)
    await this.validateDefaultContact(data.defaultContactId)
    return this.repository.update(incomeCategory, data)
  }
  async deleteIncomeCategory(id: number) {
    const incomeCategory = await this.repository.findById(id)
    this.checkOwnership(incomeCategory)
    this.ensureIncomeCategoryIsEditable(incomeCategory)
    return this.repository.delete(incomeCategory)
  }
  async getIncomeCategoryById(id: number) {
    const incomeCategory = await this.repository.findById(id)
    this.checkOwnership(incomeCategory)
    return incomeCategory
  }
  async getAllUserIncomeCategories() {
    return this.repository.findAllByUserId(this.userId)
  }

  async getPaginatedUserIncomeCategories(page: number, perPage: number) {
    return this.repository.paginateByUserId(this.userId, page, perPage)
  }

  async createMassIncomeCategories(items: CreateIncomeCategoryPayload[]) {
    const incomeCategories = []
    for (const item of items) {
      incomeCategories.push(await this.createIncomeCategory(item))
    }
    return incomeCategories
  }

  async updateMassIncomeCategories(items: MassUpdateIncomeCategoryPayload[]) {
    const incomeCategories = []
    for (const item of items) {
      const { id, ...data } = item
      incomeCategories.push(await this.updateIncomeCategory(id, data))
    }
    return incomeCategories
  }

  async deleteMassIncomeCategories(ids: number[]) {
    for (const id of ids) {
      await this.deleteIncomeCategory(id)
    }
  }
}
