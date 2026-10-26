import { BackendLoader } from "@/components/backend-loader"
import { I18nProviderClient } from "@/lib/i18n/client"

/**
 * Served by the proxy (as a rewrite) until the API has passed its health
 * check. It lives outside app/[locale] on purpose: that layout fetches the
 * profile from the API, which would block on a sleeping server.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <I18nProviderClient locale={locale}>
      <BackendLoader />
    </I18nProviderClient>
  )
}
