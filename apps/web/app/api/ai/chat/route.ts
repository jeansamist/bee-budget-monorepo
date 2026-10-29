import { API_URL } from "@/lib/backend"
import { cookies } from "next/headers"

const FORWARDED_HEADERS = [
  "content-type",
  "cache-control",
  "x-vercel-ai-ui-message-stream",
  "x-accel-buffering",
]

// The auth token lives in an httpOnly cookie, so the chat goes through here
// to reach the API with it, and the answer is streamed back as is.
export async function POST(request: Request) {
  const token = (await cookies()).get("AUTH_TOKEN")?.value
  if (!token) {
    return Response.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    )
  }

  const response = await fetch(`${API_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: await request.text(),
    signal: request.signal,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    return new Response(body?.message ?? "Something went wrong", {
      status: response.status,
    })
  }

  // Hop-by-hop headers (transfer-encoding, connection...) are left out
  const headers = new Headers()
  for (const name of FORWARDED_HEADERS) {
    const value = response.headers.get(name)
    if (value) headers.set(name, value)
  }
  return new Response(response.body, { status: response.status, headers })
}
