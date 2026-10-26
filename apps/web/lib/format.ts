/**
 * Default records are stored as constants (ORANGE_MONEY, BANK_ACCOOUNT…).
 * Shows them as "Orange Money"; names typed by the user are left as they are.
 */
export function displayName(name: string | null | undefined) {
  if (!name) return ""
  if (!/^[A-Z0-9_]+$/.test(name)) return name
  return name
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/** 182500 -> "182,500" (same formatting as the rest of the app). */
export function formatAmount(amount: number) {
  return amount.toLocaleString()
}
