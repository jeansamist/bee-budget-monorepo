import { IncomeCategorySchema } from '#database/schema'
import IncomeCategoryRepository from '#repositories/income_category_repository'
import WalletTypeRepository from '#repositories/wallet_type_repository'
import { httpError } from '#utils/http_error'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type CreateIncomeCategoryPayload = {
  name: string
  icon?: string | null
  color: string
  defaultWalletTypeId?: number | null
}

type UpdateIncomeCategoryPayload = Partial<{
  name: string
  icon: string | null
  color: string
  defaultWalletTypeId: number | null
}>

@inject()
export class IncomeCategoryService {
  constructor(
    private readonly repository: IncomeCategoryRepository,
    private readonly walletTypeRepository: WalletTypeRepository,
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

  private async validateDefaultWalletType(defaultWalletTypeId: number | null | undefined) {
    if (defaultWalletTypeId === undefined || defaultWalletTypeId === null) {
      return
    }

    const walletType = await this.walletTypeRepository.findById(defaultWalletTypeId)
    if (walletType.userId !== this.userId) {
      throw httpError(422, 'The selected default wallet type is invalid')
    }
  }

  async createIncomeCategory(data: CreateIncomeCategoryPayload) {
    await this.validateDefaultWalletType(data.defaultWalletTypeId)
    return this.repository.create({
      ...data,
      icon: data.icon ?? null,
      defaultWalletTypeId: data.defaultWalletTypeId ?? null,
      userId: this.userId,
    })
  }
  async updateIncomeCategory(id: number, data: UpdateIncomeCategoryPayload) {
    const incomeCategory = await this.repository.findById(id)
    this.checkOwnership(incomeCategory)
    await this.validateDefaultWalletType(data.defaultWalletTypeId)
    return this.repository.update(incomeCategory, data)
  }
  async deleteIncomeCategory(id: number) {
    const incomeCategory = await this.repository.findById(id)
    this.checkOwnership(incomeCategory)
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
}
