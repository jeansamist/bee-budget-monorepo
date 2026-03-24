import { createI18nMiddleware } from "next-international/middleware"

const I18nMiddleware = createI18nMiddleware({
  locales: ["en"],
  defaultLocale: "en",
  urlMappingStrategy: "redirect",
})

export { I18nMiddleware as middleware }

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)"],
}
