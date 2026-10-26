export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

/**
 * Set once the API answered its health check. Render free instances sleep
 * after 15 minutes without traffic, so the cookie lives a bit less than that
 * and is renewed by the proxy on every request.
 */
export const BACKEND_READY_COOKIE = "BACKEND_READY"
export const BACKEND_READY_MAX_AGE = 10 * 60
