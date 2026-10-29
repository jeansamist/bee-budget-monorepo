import { AiChat } from "@/components/ai/ai-chat"
import { AppHeader } from "@/components/app-header"
import { getI18n } from "@/lib/i18n/server"
import { getAiConversations } from "@/services/ai.services"
import { generateId } from "ai"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()
  return { title: t("app.header.titles.ai") }
}

export default async function Page() {
  const t = await getI18n()
  const conversations = await getAiConversations()
  const id = generateId()

  return (
    <main className="flex min-h-svh flex-col">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.ai"), href: "#" },
        ]}
        title={t("app.header.titles.ai")}
      />
      {/* A new conversation: its id is saved with the first answer */}
      <AiChat
        key={id}
        id={id}
        conversations={conversations.success ? (conversations.data ?? []) : []}
      />
    </main>
  )
}
