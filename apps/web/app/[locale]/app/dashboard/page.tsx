import { AppHeader } from "@/components/app-header"

export default function page() {
  return (
    <main className="space-y-4">
      <AppHeader
        path={[
          { label: "Jeansamist", href: "#" },
          { label: "Dashboard", href: "#" },
        ]}
        userFirstName="Ephraim"
      />
    </main>
  )
}
