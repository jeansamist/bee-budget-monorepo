import { createTuyau } from "@tuyau/client"
import { registry } from "api/registry"

export const tuyau = createTuyau({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: { Accept: "application/json" },
  api: {
    definition: registry.$tree,
  },
})
