import { Landing } from "@/components/landing/landing"
import { getScopedI18n } from "@/lib/i18n/server"
import type { Metadata } from "next"
import { cookies } from "next/headers"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("landing.meta")
  return { title: t("title"), description: t("description") }
}

export default async function Page() {
  // Only checks for a token: the landing page must not wait on the API.
  const hasSession = (await cookies()).has("AUTH_TOKEN")

  return <Landing hasSession={hasSession} />
}
