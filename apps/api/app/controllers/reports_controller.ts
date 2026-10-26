import { ReportService } from '#services/report_service'
import { ApiResponse } from '#utils/api_response'
import { reportValidator } from '#validators/report'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ReportsController {
  constructor(protected readonly reportService: ReportService) {}

  async index({ request, response }: HttpContext) {
    const { walletIds, ...options } = await request.validateUsing(reportValidator)
    const report = await this.reportService.generate({
      ...options,
      walletIds: walletIds?.split(',').map(Number),
    })
    return response.ok(ApiResponse.success(report, 'Report generated successfully'))
  }
}
