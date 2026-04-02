import { WalletTypeService } from '#services/wallet_type_service'
import WalletTypeTransformer from '#transformers/wallet_type_transformer'
import { ApiResponse } from '#utils/api_response'
import {
  createWalletTypeValidator,
  updateWalletTypeValidator,
} from '#validators/wallet_type'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WalletTypesController {
  constructor(protected readonly walletTypeService: WalletTypeService) {}

  async index({ serialize, response }: HttpContext) {
    const walletTypes = await this.walletTypeService.getAllUserWalletTypes()
    const serialized = await serialize(WalletTypeTransformer.transform(walletTypes))
    return response.ok(ApiResponse.success(serialized.data, 'Wallet types retrieved successfully'))
  }

  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createWalletTypeValidator)
    const walletType = await this.walletTypeService.createWalletType(payload)
    const serialized = await serialize(WalletTypeTransformer.transform(walletType))
    return response.ok(ApiResponse.success(serialized.data, 'Wallet type created successfully'))
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

  async destroy({ params, response }: HttpContext) {
    await this.walletTypeService.deleteWalletType(params.id)
    return response.ok(ApiResponse.success(null, 'Wallet type deleted successfully'))
  }
}
