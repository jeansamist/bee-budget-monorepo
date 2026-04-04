import { TransactionAnalyticsService } from '#services/transaction_analytics_service'
import { ApiResponse } from '#utils/api_response'
import { transactionAnalyticsValidator } from '#validators/transaction_analytics'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TransactionAnalyticsController {
  constructor(protected readonly transactionAnalyticsService: TransactionAnalyticsService) {}

  async index({ request, response }: HttpContext) {
    const { period = 'monthly' } = await request.validateUsing(transactionAnalyticsValidator)
    const analytics = await this.transactionAnalyticsService.getTransactionAnalytics(period)

    return response.ok(
      ApiResponse.success(analytics, 'Transaction analytics retrieved successfully')
    )
  }
}
