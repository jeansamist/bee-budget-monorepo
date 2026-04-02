import { WalletService } from '#services/wallet_service'
import WalletTransformer from '#transformers/wallet_transformer'
import { ApiResponse } from '#utils/api_response'
import { createWalletValidator, updateWalletValidator } from '#validators/wallet'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WalletsController {
  constructor(protected readonly walletService: WalletService) {}

  /**
   * Display a list of resource
   */
  async index({ serialize, response }: HttpContext) {
    const wallets = await this.walletService.getAllUserWallets()
    const serialized = await serialize(WalletTransformer.transform(wallets))
    return response.ok(ApiResponse.success(serialized.data, 'Wallets retrieved successfully'))
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

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.walletService.deleteWallet(params.id)
    return response.ok(ApiResponse.success(null, 'Wallet deleted successfully'))
  }
}
