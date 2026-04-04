import { InternalTransferService } from '#services/internal_transfer_service'
import InternalTransferTransformer from '#transformers/internal_transfer_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createInternalTransferValidator,
  createMassInternalTransferValidator,
  deleteMassInternalTransferValidator,
  updateInternalTransferValidator,
  updateMassInternalTransferValidator,
} from '#validators/internal_transfer'
import { paginateWithWalletValidator } from '#validators/pagination'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class InternalTransfersController {
  constructor(protected readonly internalTransferService: InternalTransferService) {}

  async index({ request, serialize, response }: HttpContext) {
    const { page = 1, perPage = 15, walletId } = await request.validateUsing(paginateWithWalletValidator)
    const paginator = await this.internalTransferService.getPaginatedUserInternalTransfers(
      page,
      perPage,
      walletId
    )
    const serialized = await serialize(InternalTransferTransformer.transform(paginator.all()))
    return response.ok(
      ApiResponse.success(
        serialized.data,
        'Internal transfers retrieved successfully',
        paginator.getMeta()
      )
    )
  }

  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createInternalTransferValidator)
    const transfer = await this.internalTransferService.createInternalTransfer(payload)
    const serialized = await serialize(InternalTransferTransformer.transform(transfer))
    return response.ok(
      ApiResponse.success(serialized.data, 'Internal transfer created successfully')
    )
  }

  async createMass({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createMassInternalTransferValidator)
    const transfers = await this.internalTransferService.createMassInternalTransfers(payload.items)
    const serialized = await serialize(InternalTransferTransformer.transform(transfers))
    return response.ok(
      ApiResponse.success(serialized.data, 'Internal transfers created successfully')
    )
  }

  async show({ params, serialize, response }: HttpContext) {
    const transfer = await this.internalTransferService.getInternalTransferById(params.id)
    const serialized = await serialize(InternalTransferTransformer.transform(transfer))
    return response.ok(
      ApiResponse.success(serialized.data, 'Internal transfer retrieved successfully')
    )
  }

  async update({ params, request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateInternalTransferValidator)
    const transfer = await this.internalTransferService.updateInternalTransfer(params.id, payload)
    const serialized = await serialize(InternalTransferTransformer.transform(transfer))
    return response.ok(
      ApiResponse.success(serialized.data, 'Internal transfer updated successfully')
    )
  }

  async updateMass({ request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateMassInternalTransferValidator)
    const transfers = await this.internalTransferService.updateMassInternalTransfers(payload.items)
    const serialized = await serialize(InternalTransferTransformer.transform(transfers))
    return response.ok(
      ApiResponse.success(serialized.data, 'Internal transfers updated successfully')
    )
  }

  async destroy({ params, response }: HttpContext) {
    await this.internalTransferService.deleteInternalTransfer(params.id)
    return response.ok(ApiResponse.success(null, 'Internal transfer deleted successfully'))
  }

  async deleteMass({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteMassInternalTransferValidator)
    await this.internalTransferService.deleteMassInternalTransfers(payload.ids)
    return response.ok(
      ApiResponse.success({ count: payload.ids.length }, 'Internal transfers deleted successfully')
    )
  }
}
