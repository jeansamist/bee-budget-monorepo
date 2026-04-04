"use server"

import { tuyau } from "@/lib/api"
import type {
  CreateInternalTransferSchema,
  UpdateInternalTransferSchema,
  UpdateMassInternalTransferSchema,
} from "@/schemas/internal-transfers.schemas"
import type {
  ApiResponse,
  IndexParams,
  InternalTransfer,
  MassDeleteResult,
} from "@/types"

export const getInternalTransfers = async (
  params: IndexParams = {}
): Promise<ApiResponse<InternalTransfer[]>> => {
  const { page = 1, perPage = 15, fetchAll = false, walletId } = params
  const query = fetchAll
    ? { page: 1, perPage: 100000, walletId }
    : { page, perPage, walletId }
  const [data, error] = await tuyau.api.internalTransfers.index({ query }).safe()
  return (error ? error.response : data) as ApiResponse<InternalTransfer[]>
}

export const getInternalTransfer = async (
  id: number
): Promise<ApiResponse<InternalTransfer>> => {
  const [data, error] = await tuyau.api.internalTransfers
    .show({ params: { id } })
    .safe()
  return (error ? error.response : data) as ApiResponse<InternalTransfer>
}

export const createInternalTransfer = async (
  payload: CreateInternalTransferSchema
): Promise<ApiResponse<InternalTransfer>> => {
  const [data, error] = await tuyau.api.internalTransfers
    .store({ body: payload })
    .safe()
  return (error ? error.response : data) as ApiResponse<InternalTransfer>
}

export const createMassInternalTransfers = async (
  items: CreateInternalTransferSchema[]
): Promise<ApiResponse<InternalTransfer[]>> => {
  const [data, error] = await tuyau.api.internalTransfers
    .createMass({ body: { items } })
    .safe()
  return (error ? error.response : data) as ApiResponse<InternalTransfer[]>
}

export const updateInternalTransfer = async (
  id: number,
  payload: UpdateInternalTransferSchema
): Promise<ApiResponse<InternalTransfer>> => {
  const [data, error] = await tuyau.api.internalTransfers
    .update({
      params: { id },
      body: payload,
    })
    .safe()
  return (error ? error.response : data) as ApiResponse<InternalTransfer>
}

export const updateMassInternalTransfers = async (
  items: UpdateMassInternalTransferSchema[]
): Promise<ApiResponse<InternalTransfer[]>> => {
  const [data, error] = await tuyau.api.internalTransfers
    .updateMass({ body: { items } })
    .safe()
  return (error ? error.response : data) as ApiResponse<InternalTransfer[]>
}

export const deleteInternalTransfer = async (
  id: number
): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.internalTransfers
    .destroy({ params: { id } })
    .safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const deleteMassInternalTransfers = async (
  ids: number[]
): Promise<ApiResponse<MassDeleteResult>> => {
  const [data, error] = await tuyau.api.internalTransfers
    .deleteMass({ body: { ids } })
    .safe()
  return (error ? error.response : data) as ApiResponse<MassDeleteResult>
}
