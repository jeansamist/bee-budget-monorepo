import { WalletService } from '#services/wallet_service'
import { WalletAnalyticsService } from '#services/wallet_analytics_service'
import { ApiResponse } from '#utils/api_response'
import { walletAnalyticsValidator } from '#validators/wallet_analytics'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WalletAnalyticsController {
  constructor(
    protected readonly walletService: WalletService,
    protected readonly walletAnalyticsService: WalletAnalyticsService
  ) {}

  async index({ params, request, response }: HttpContext) {
    const wallet = await this.walletService.getWalletById(params.id)
    const { period = 'monthly' } = await request.validateUsing(walletAnalyticsValidator)
    const analytics = await this.walletAnalyticsService.getWalletAnalytics(wallet.id, period)
    return response.ok(ApiResponse.success(analytics, 'Wallet analytics retrieved successfully'))
  }
}
