import { REPORT_TYPES } from '#services/report_service'
import vine from '@vinejs/vine'

const isoDate = /^\d{4}-\d{2}-\d{2}$/

export const reportValidator = vine.create(
  vine.object({
    type: vine.enum(REPORT_TYPES),
    from: vine.string().regex(isoDate).optional(),
    to: vine.string().regex(isoDate).optional(),
    // Comma-separated wallet ids, e.g. "1,4"
    walletIds: vine
      .string()
      .regex(/^\d+(,\d+)*$/)
      .optional(),
  })
)
