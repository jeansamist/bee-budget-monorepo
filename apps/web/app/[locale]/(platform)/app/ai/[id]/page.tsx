import { AiChat } from "@/components/ai/ai-chat"
import { AppHeader } from "@/components/app-header"
import { getI18n } from "@/lib/i18n/server"
import { getAiConversation, getAiConversations } from "@/services/ai.services"
import type { UIMessage } from "ai"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getI18n()
  const result = await getAiConversation((await params).id)
  return {
    title:
      result.success && result.data
        ? result.data.title
        : t("app.header.titles.ai"),
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const t = await getI18n()
  const [conversation, conversations] = await Promise.all([
    getAiConversation(id),
    getAiConversations(),
  ])
  if (!conversation.success || !conversation.data) notFound()

  return (
    <main className="flex min-h-svh flex-col">
      <AppHeader
        path={[
          { label: t("app.header.breadcrumb.brand"), href: "#" },
          { label: t("app.header.breadcrumb.ai"), href: "#" },
        ]}
        title={conversation.data.title}
      />
      <AiChat
        key={id}
        id={id}
        initialMessages={conversation.data.messages as UIMessage[]}
        initialModel={{
          provider: conversation.data.provider,
          model: conversation.data.model,
        }}
        conversations={conversations.success ? (conversations.data ?? []) : []}
      />
    </main>
  )
}
