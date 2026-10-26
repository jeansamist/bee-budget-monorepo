// Words that keep their own casing in default names
const SPECIAL_WORDS: Record<string, string> = { MTN: "MTN", MOMO: "MoMo" }

/**
 * Default records are stored as constants (ORANGE_MONEY, BANK_ACCOOUNT…).
 * Shows them as "Orange Money"; names typed by the user are left as they are.
 */
export function displayName(name: string | null | undefined) {
  if (!name) return ""
  if (!/^[A-Z0-9_]+$/.test(name)) return name
  return name
    .split("_")
    .filter(Boolean)
    .map(
      (word) =>
        SPECIAL_WORDS[word] ?? word.charAt(0) + word.slice(1).toLowerCase()
    )
    .join(" ")
}

/** 182500 -> "182,500" (same formatting as the rest of the app). */
export function formatAmount(amount: number) {
  return amount.toLocaleString()
}
