"use client"

import { Confirm } from "@/components/confirm"
import { useCurrentLocaleUrl, useI18n } from "@/lib/i18n/client"
import type { AiConversation } from "@/types"
import { cn } from "@bee-budget/functions"
import { Button } from "@bee-budget/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export function ConversationList({
  conversations,
  activeId,
  onDelete,
  onNavigate,
}: {
  conversations: AiConversation[]
  activeId?: string
  onDelete: (id: string) => void
  onNavigate?: () => void
}) {
  const t = useI18n()
  const { currentLocaleUrl } = useCurrentLocaleUrl()

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <Button asChild variant="outline" size="sm" className="justify-start">
        <Link href={currentLocaleUrl("/app/ai")} onClick={onNavigate}>
          <Plus />
          {t("app.ai.newChat")}
        </Link>
      </Button>
      <p className="px-2 text-xs font-medium text-muted-foreground">
        {t("app.ai.history.title")}
      </p>
      {conversations.length === 0 ? (
        <p className="px-2 text-sm text-muted-foreground">
          {t("app.ai.history.empty")}
        </p>
      ) : (
        <ul className="min-h-0 space-y-0.5 overflow-y-auto">
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className={cn(
                "group flex items-center gap-1 rounded-xl hover:bg-muted",
                conversation.id === activeId && "bg-muted"
              )}
            >
              <Link
                href={currentLocaleUrl(`/app/ai/${conversation.id}`)}
                onClick={onNavigate}
                className="min-w-0 flex-1 px-2 py-1.5"
              >
                <p className="truncate text-sm">{conversation.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
              </Link>
              <Confirm
                title={t("app.ai.history.deleteTitle")}
                content={t("app.ai.history.deleteDescription")}
                onConfirm={() => onDelete(conversation.id)}
              >
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-lg:opacity-100"
                  aria-label={t("app.ai.history.delete")}
                >
                  <Trash2 />
                </Button>
              </Confirm>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
