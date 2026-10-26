import { AuthProvider } from "@/contexts/auth.context"
import { getProfile } from "@/services/auth.services"

/**
 * Everything that needs the API (the app and the auth pages) lives in this
 * group, so the landing page renders without waiting on the API.
 */
export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getProfile()

  return <AuthProvider user={user}>{children}</AuthProvider>
}
