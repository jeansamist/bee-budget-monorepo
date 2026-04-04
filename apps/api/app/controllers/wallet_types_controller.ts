import { WalletTypeService } from '#services/wallet_type_service'
import WalletTypeTransformer from '#transformers/wallet_type_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createWalletTypeValidator,
  createMassWalletTypeValidator,
  deleteMassWalletTypeValidator,
  updateWalletTypeValidator,
  updateMassWalletTypeValidator,
} from '#validators/wallet_type'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WalletTypesController {
  constructor(protected readonly walletTypeService: WalletTypeService) {}

  async index({ request, serialize, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 15)
    const paginator = await this.walletTypeService.getPaginatedUserWalletTypes(page, perPage)
    const serialized = await serialize(WalletTypeTransformer.transform(paginator.all()))
    return response.ok(
      ApiResponse.success(
        serialized.data,
        'Wallet types retrieved successfully',
        paginator.getMeta()
      )
    )
  }

  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createWalletTypeValidator)
    const walletType = await this.walletTypeService.createWalletType(payload)
    const serialized = await serialize(WalletTypeTransformer.transform(walletType))
    return response.ok(ApiResponse.success(serialized.data, 'Wallet type created successfully'))
  }

  async createMass({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createMassWalletTypeValidator)
    const walletTypes = await this.walletTypeService.createMassWalletTypes(payload.items)
    const serialized = await serialize(WalletTypeTransformer.transform(walletTypes))
    return response.ok(ApiResponse.success(serialized.data, 'Wallet types created successfully'))
  }

  async show({ params, serialize, response }: HttpContext) {
    const walletType = await this.walletTypeService.getWalletTypeById(params.id)
    const serialized = await serialize(WalletTypeTransformer.transform(walletType))
    return response.ok(ApiResponse.success(serialized.data, 'Wallet type retrieved successfully'))
  }

  async update({ params, request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateWalletTypeValidator)
    const walletType = await this.walletTypeService.updateWalletType(params.id, payload)
    const serialized = await serialize(WalletTypeTransformer.transform(walletType))
    return response.ok(ApiResponse.success(serialized.data, 'Wallet type updated successfully'))
  }

  async updateMass({ request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(updateMassWalletTypeValidator)
    const walletTypes = await this.walletTypeService.updateMassWalletTypes(payload.items)
    const serialized = await serialize(WalletTypeTransformer.transform(walletTypes))
    return response.ok(ApiResponse.success(serialized.data, 'Wallet types updated successfully'))
  }

  async destroy({ params, response }: HttpContext) {
    await this.walletTypeService.deleteWalletType(params.id)
    return response.ok(ApiResponse.success(null, 'Wallet type deleted successfully'))
  }

  async deleteMass({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteMassWalletTypeValidator)
    await this.walletTypeService.deleteMassWalletTypes(payload.ids)
    return response.ok(
      ApiResponse.success({ count: payload.ids.length }, 'Wallet types deleted successfully')
    )
  }
}
