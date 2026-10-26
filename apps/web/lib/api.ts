import { createTuyau } from "@tuyau/core/client"
import { registry } from "api/registry"
import { cookies } from "next/headers"
import { API_URL } from "./backend"

export const tuyau = createTuyau({
  baseUrl: API_URL,
  headers: { Accept: "application/json" },
  registry,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = (await cookies()).get("AUTH_TOKEN")?.value
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`)
        }
      },
    ],
  },
})
