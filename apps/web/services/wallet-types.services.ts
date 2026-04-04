"use server"

import { tuyau } from "@/lib/api"
import type {
  CreateWalletTypeSchema,
  UpdateWalletTypeSchema,
  UpdateMassWalletTypeSchema,
} from "@/schemas/wallet-types.schemas"
import type {
  ApiResponse,
  IndexParams,
  WalletType,
  MassDeleteResult,
} from "@/types"

export const getWalletTypes = async (params: IndexParams = {}): Promise<ApiResponse<WalletType[]>> => {
  const { page = 1, perPage = 15, fetchAll = false } = params
  const query = fetchAll ? { page: 1, perPage: 100000 } : { page, perPage }
  const [data, error] = await tuyau.api.walletTypes.index({ query }).safe()
  return (error ? error.response : data) as ApiResponse<WalletType[]>
}

export const getWalletType = async (id: number): Promise<ApiResponse<WalletType>> => {
  const [data, error] = await tuyau.api.walletTypes.show({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<WalletType>
}

export const createWalletType = async (
  payload: CreateWalletTypeSchema
): Promise<ApiResponse<WalletType>> => {
  const [data, error] = await tuyau.api.walletTypes.store({ body: payload }).safe()
  return (error ? error.response : data) as ApiResponse<WalletType>
}

export const createMassWalletTypes = async (
  items: CreateWalletTypeSchema[]
): Promise<ApiResponse<WalletType[]>> => {
  const [data, error] = await tuyau.api.walletTypes.createMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<WalletType[]>
}

export const updateWalletType = async (
  id: number,
  payload: UpdateWalletTypeSchema
): Promise<ApiResponse<WalletType>> => {
  const [data, error] = await tuyau.api.walletTypes.update({
    params: { id },
    body: payload,
  }).safe()
  return (error ? error.response : data) as ApiResponse<WalletType>
}

export const updateMassWalletTypes = async (
  items: UpdateMassWalletTypeSchema[]
): Promise<ApiResponse<WalletType[]>> => {
  const [data, error] = await tuyau.api.walletTypes.updateMass({ body: { items } }).safe()
  return (error ? error.response : data) as ApiResponse<WalletType[]>
}

export const deleteWalletType = async (id: number): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.walletTypes.destroy({ params: { id } }).safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const deleteMassWalletTypes = async (
  ids: number[]
): Promise<ApiResponse<MassDeleteResult>> => {
  const [data, error] = await tuyau.api.walletTypes.deleteMass({ body: { ids } }).safe()
  return (error ? error.response : data) as ApiResponse<MassDeleteResult>
}
