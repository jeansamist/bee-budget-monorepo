import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/**
 * False during the server render and hydration, true afterwards. Use it for
 * values only the browser knows (like the theme) to avoid hydration mismatches.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
