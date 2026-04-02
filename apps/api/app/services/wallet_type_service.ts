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
}
