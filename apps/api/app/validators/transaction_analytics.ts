import vine from '@vinejs/vine'

export const transactionAnalyticsValidator = vine.create(
  vine.object({
    period: vine.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  })
)
