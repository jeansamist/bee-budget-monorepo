export const INTERNAL_TRANSFER_INCOME_CATEGORY_NAME = 'INTERNAL_TRANSFER_IN'
export const INTERNAL_TRANSFER_EXPENSE_CATEGORY_NAME = 'INTERNAL_TRANSFER_OUT'

export function buildInternalTransferName(sourceWalletName: string, targetWalletName: string) {
  return `Transfer from ${sourceWalletName} to ${targetWalletName}`
}

export function buildInternalTransferExpenseDescription(
  description: string | null | undefined,
  targetWalletName: string
) {
  return description?.trim() || `Internal transfer to ${targetWalletName}`
}

export function buildInternalTransferIncomeDescription(
  description: string | null | undefined,
  sourceWalletName: string
) {
  return description?.trim() || `Internal transfer from ${sourceWalletName}`
}
