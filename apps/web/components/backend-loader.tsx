"use client"

import { useI18n } from "@/lib/i18n/client"
import {
  API_URL,
  BACKEND_READY_COOKIE,
  BACKEND_READY_MAX_AGE,
} from "@/lib/backend"
import { Button } from "@bee-budget/ui/button"
import { Spinner } from "@bee-budget/ui/spinner"
import { useCallback, useEffect, useState } from "react"

const ATTEMPT_TIMEOUT_MS = 15_000
const RETRY_DELAY_MS = 2_000
const SLOW_AFTER_MS = 5_000
const GIVE_UP_AFTER_MS = 120_000

type Status = "waking" | "slow" | "failed"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function isBackendHealthy() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
    })
    return response.ok
  } catch {
    return false
  }
}

export function BackendLoader() {
  const t = useI18n()
  const [status, setStatus] = useState<Status>("waking")
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => {
    setStatus("waking")
    setAttempt((previousAttempt) => previousAttempt + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    const startedAt = Date.now()
    const slowTimer = setTimeout(() => {
      if (!cancelled) setStatus("slow")
    }, SLOW_AFTER_MS)

    async function wakeBackend() {
      while (!cancelled && Date.now() - startedAt < GIVE_UP_AFTER_MS) {
        if (await isBackendHealthy()) {
          if (cancelled) return
          document.cookie = `${BACKEND_READY_COOKIE}=1; path=/; max-age=${BACKEND_READY_MAX_AGE}; samesite=lax`
          // The proxy now lets the request through to the real page.
          window.location.reload()
          return
        }
        await wait(RETRY_DELAY_MS)
      }
      if (!cancelled) setStatus("failed")
    }

    wakeBackend()

    return () => {
      cancelled = true
      clearTimeout(slowTimer)
    }
  }, [attempt])

  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4">
      <div className="fixed bottom-0 left-1/2 z-0 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div
        className="relative z-10 flex max-w-sm flex-col items-center gap-4 text-center"
        aria-live="polite"
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("common.app-name")}
        </h1>
        {status === "failed" ? (
          <>
            <p className="text-sm text-muted-foreground">
              {t("backendLoader.failed")}
            </p>
            <Button onClick={retry}>{t("backendLoader.retry")}</Button>
          </>
        ) : (
          <>
            <Spinner className="size-6 text-primary" />
            <p className="text-sm text-muted-foreground">
              {status === "slow"
                ? t("backendLoader.slow")
                : t("backendLoader.waking")}
            </p>
          </>
        )}
      </div>
    </main>
  )
}
