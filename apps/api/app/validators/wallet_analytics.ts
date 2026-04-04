import vine from '@vinejs/vine'

export const walletAnalyticsValidator = vine.create(
  vine.object({
    period: vine.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  })
)
