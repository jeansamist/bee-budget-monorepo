import { WalletTypeSchema } from '#database/schema'
import WalletTypeRepository from '#repositories/wallet_type_repository'
import { httpError } from '#utils/http_error'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type CreateWalletTypePayload = {
  name: string
  color: string
  icon?: string | null
}

type UpdateWalletTypePayload = Partial<{
  name: string
  color: string
  icon: string | null
}>
type MassUpdateWalletTypePayload = UpdateWalletTypePayload & { id: number }

@inject()
export class WalletTypeService {
  constructor(
    private readonly repository: WalletTypeRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  checkOwnership(walletType: WalletTypeSchema) {
    if (walletType.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this wallet type')
    }
  }

  async createWalletType(data: CreateWalletTypePayload) {
    return this.repository.create({
      ...data,
      icon: data.icon ?? null,
      userId: this.userId,
    })
  }

  async updateWalletType(id: number, data: UpdateWalletTypePayload) {
    const walletType = await this.repository.findById(id)
    this.checkOwnership(walletType)
    return this.repository.update(walletType, data)
  }

  async deleteWalletType(id: number) {
    const walletType = await this.repository.findById(id)
    this.checkOwnership(walletType)
    return this.repository.delete(walletType)
  }

  async getWalletTypeById(id: number) {
    const walletType = await this.repository.findById(id)
    this.checkOwnership(walletType)
    return walletType
  }

  async getAllUserWalletTypes() {
    return this.repository.findAllByUserId(this.userId)
  }

  async getPaginatedUserWalletTypes(page: number, perPage: number) {
    return this.repository.paginateByUserId(this.userId, page, perPage)
  }

  async createMassWalletTypes(items: CreateWalletTypePayload[]) {
    const walletTypes = []
    for (const item of items) {
      walletTypes.push(await this.createWalletType(item))
    }
    return walletTypes
  }

  async updateMassWalletTypes(items: MassUpdateWalletTypePayload[]) {
    const walletTypes = []
    for (const item of items) {
      const { id, ...data } = item
      walletTypes.push(await this.updateWalletType(id, data))
    }
    return walletTypes
  }

  async deleteMassWalletTypes(ids: number[]) {
    for (const id of ids) {
      await this.deleteWalletType(id)
    }
  }
}
