import { I18nProviderClient } from "@/lib/i18n/client"
import { getStaticParams } from "@/lib/i18n/server"

export function generateStaticParams() {
  return getStaticParams()
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
