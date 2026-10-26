import { createI18nMiddleware } from "next-international/middleware"
import { type NextRequest, NextResponse } from "next/server"
import { BACKEND_READY_COOKIE, BACKEND_READY_MAX_AGE } from "@/lib/backend"

const I18nMiddleware = createI18nMiddleware({
  locales: ["en"],
  defaultLocale: "en",
  urlMappingStrategy: "redirect",
})

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.includes("/_next/") || /\.\w+$/.test(pathname)) {
    return NextResponse.next()
  }

  const backendReady = request.cookies.has(BACKEND_READY_COOKIE)

  // Full page loads wait on the loader until the API is awake. Client-side
  // navigations (RSC) and server actions are left alone: they only happen
  // after a page load, and rewriting them would break the router.
  if (!backendReady && isDocumentRequest(request)) {
    const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/)
    const url = request.nextUrl.clone()
    url.pathname = `/starting/${localeMatch?.[1] ?? "en"}`
    return NextResponse.rewrite(url)
  }

  const response = handleRequest(request)

  // Sliding expiry: keep the flag while the app (and so the API) is in use.
  if (backendReady) {
    response.cookies.set(BACKEND_READY_COOKIE, "1", {
      path: "/",
      maxAge: BACKEND_READY_MAX_AGE,
      sameSite: "lax",
    })
  }

  return response
}

function isDocumentRequest(request: NextRequest) {
  return (
    request.method === "GET" &&
    !request.headers.has("rsc") &&
    !request.headers.has("next-action") &&
    !request.nextUrl.pathname.startsWith("/starting") &&
    !isLandingPath(request.nextUrl.pathname)
  )
}

// The landing page never calls the API, so it doesn't wait for it
function isLandingPath(pathname: string) {
  return /^\/([a-z]{2}\/?)?$/.test(pathname)
}

function handleRequest(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("AUTH_TOKEN")?.value

  if (token && /\/auth(\/|$)/.test(pathname)) {
    const localeMatch = pathname.match(/^\/([a-z]{2})\//)
    const locale = localeMatch?.[1] ?? "en"
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/app/dashboard`
    return NextResponse.redirect(url)
  }

  return I18nMiddleware(request)
}

export const proxyConfig = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)"],
}
