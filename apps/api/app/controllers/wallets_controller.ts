import { WalletService } from '#services/wallet_service'
import WalletTransformer from '#transformers/wallet_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createWalletValidator,
  createMassWalletValidator,
  deleteMassWalletValidator,
  updateWalletValidator,
  updateMassWalletValidator,
} from '#validators/wallet'
import { paginateValidator } from '#validators/pagination'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WalletsController {
  constructor(protected readonly walletService: WalletService) {}

  /**
   * Display a list of resource
   */
  async index({ request, serialize, response }: HttpContext) {
    const { page = 1, perPage = 15 } = await request.validateUsing(paginateValidator)
    const paginator = await this.walletService.getPaginatedUserWallets(page, perPage)
    const serialized = await serialize(WalletTransformer.transform(paginator.all()))
    return response.ok(
      ApiResponse.success(serialized.data, 'Wallets retrieved successfully', paginator.getMeta())
    )
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createWalletValidator)
    const wallet = await this.walletService.createWallet(payload)
    const serialized = await serialize(WalletTransformer.transform(wallet))
    return response.ok(ApiResponse.success(serialized.data, 'Wallet created successfully'))
  }

  async createMass({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createMassWalletValidator)
    const wallets = await this.walletService.createMassWallets(payload.items)
    const serialized = await serialize(WalletTransformer.transform(wallets))
    return response.ok(ApiResponse.success(serialized.data, 'Wallets created successfully'))
  }

  /**
   * Show individual record
   */
  async show({ params, serialize, response }: HttpContext) {
    const wallet = await this.walletService.getWalletById(params.id)
    const serialized = await serialize(WalletTransformer.transform(wallet))
    return response.ok(ApiResponse.success(serialized.data, 'Wallet retrieved successfully'))
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateWalletValidator)
    const wallet = await this.walletService.updateWallet(params.id, payload)
    const serialized = await serialize(WalletTransformer.transform(wallet))
    return response.ok(ApiResponse.success(serialized.data, 'Wallet updated successfully'))
  }

  async updateMass({ request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateMassWalletValidator)
    const wallets = await this.walletService.updateMassWallets(payload.items)
    const serialized = await serialize(WalletTransformer.transform(wallets))
    return response.ok(ApiResponse.success(serialized.data, 'Wallets updated successfully'))
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.walletService.deleteWallet(params.id)
    return response.ok(ApiResponse.success(null, 'Wallet deleted successfully'))
  }

  async deleteMass({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteMassWalletValidator)
    await this.walletService.deleteMassWallets(payload.ids)
    return response.ok(
      ApiResponse.success({ count: payload.ids.length }, 'Wallets deleted successfully')
    )
  }
}
