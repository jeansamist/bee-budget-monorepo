import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns"

export const PRESETS = [
  "thisMonth",
  "lastMonth",
  "last3Months",
  "thisYear",
  "lastYear",
  "custom",
] as const
export type Preset = (typeof PRESETS)[number]

const isoDate = (date: Date) => format(date, "yyyy-MM-dd")

export function presetRange(preset: Exclude<Preset, "custom">) {
  const now = new Date()
  switch (preset) {
    case "thisMonth":
      return { from: isoDate(startOfMonth(now)), to: isoDate(endOfMonth(now)) }
    case "lastMonth": {
      const last = subMonths(now, 1)
      return {
        from: isoDate(startOfMonth(last)),
        to: isoDate(endOfMonth(last)),
      }
    }
    case "last3Months":
      return {
        from: isoDate(startOfMonth(subMonths(now, 2))),
        to: isoDate(endOfMonth(now)),
      }
    case "thisYear":
      return { from: isoDate(startOfYear(now)), to: isoDate(endOfYear(now)) }
    case "lastYear": {
      const last = subYears(now, 1)
      return { from: isoDate(startOfYear(last)), to: isoDate(endOfYear(last)) }
    }
  }
}
