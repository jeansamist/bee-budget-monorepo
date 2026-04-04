import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import WalletRepository from '#repositories/wallet_repository'
import WalletTypeRepository from '#repositories/wallet_type_repository'
import { WalletSchema, WalletTypeSchema } from '#database/schema'
import { httpError } from '#utils/http_error'

type CreateWalletPayload = {
  name: string
  description: string
  walletTypeId: number
  image?: string | null
  amount: number
}

type UpdateWalletPayload = Partial<CreateWalletPayload>
type MassUpdateWalletPayload = UpdateWalletPayload & { id: number }

@inject()
export class WalletService {
  constructor(
    private readonly repository: WalletRepository,
    private readonly walletTypeRepository: WalletTypeRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  private checkWalletOwnership(wallet: WalletSchema) {
    if (wallet.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this wallet')
    }
  }

  private checkWalletTypeOwnership(walletType: WalletTypeSchema) {
    if (walletType.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this wallet type')
    }
  }

  private async ensureWalletTypeBelongsToCurrentUser(walletTypeId: number) {
    const walletType = await this.walletTypeRepository.findById(walletTypeId)
    this.checkWalletTypeOwnership(walletType)
    return walletType
  }

  async createWallet(data: CreateWalletPayload) {
    await this.ensureWalletTypeBelongsToCurrentUser(data.walletTypeId)
    return this.repository.create({ ...data, image: data.image ?? null, userId: this.userId })
  }

  async updateWallet(id: number, data: UpdateWalletPayload) {
    const wallet = await this.repository.findById(id)
    this.checkWalletOwnership(wallet)

    if (data.walletTypeId !== undefined) {
      await this.ensureWalletTypeBelongsToCurrentUser(data.walletTypeId)
    }

    return this.repository.update(wallet, data)
  }

  async deleteWallet(id: number) {
    const wallet = await this.repository.findById(id)
    this.checkWalletOwnership(wallet)
    return this.repository.delete(wallet)
  }

  async getWalletById(id: number) {
    const wallet = await this.repository.findById(id)
    this.checkWalletOwnership(wallet)
    return wallet
  }

  async getAllUserWallets() {
    return this.repository.findAllByUserId(this.userId)
  }

  async getPaginatedUserWallets(page: number, perPage: number) {
    return this.repository.paginateByUserId(this.userId, page, perPage)
  }

  async createMassWallets(items: CreateWalletPayload[]) {
    const wallets = []
    for (const item of items) {
      wallets.push(await this.createWallet(item))
    }
    return wallets
  }

  async updateMassWallets(items: MassUpdateWalletPayload[]) {
    const wallets = []
    for (const item of items) {
      const { id, ...data } = item
      wallets.push(await this.updateWallet(id, data))
    }
    return wallets
  }

  async deleteMassWallets(ids: number[]) {
    for (const id of ids) {
      await this.deleteWallet(id)
    }
  }
}
