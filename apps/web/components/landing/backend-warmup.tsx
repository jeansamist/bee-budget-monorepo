"use client"

import {
  API_URL,
  BACKEND_READY_COOKIE,
  BACKEND_READY_MAX_AGE,
} from "@/lib/backend"
import { useEffect } from "react"

/**
 * Wakes the API (Render free tier) in the background while the visitor reads
 * the landing page, so the app is usually ready by the time they click in.
 */
export function BackendWarmup() {
  useEffect(() => {
    if (document.cookie.includes(`${BACKEND_READY_COOKIE}=`)) return
    fetch(`${API_URL}/health`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) return
        document.cookie = `${BACKEND_READY_COOKIE}=1; path=/; max-age=${BACKEND_READY_MAX_AGE}; samesite=lax`
      })
      .catch(() => {
        // Still asleep or unreachable: the loader takes over on the next page.
      })
  }, [])

  return null
}
