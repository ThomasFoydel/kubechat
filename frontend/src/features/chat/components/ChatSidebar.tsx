'use client'

import {
  Plus,
  MessageSquare
} from 'lucide-react'

interface ChatSidebarProps {
  onNewChat: () => void
}

export function ChatSidebar({
  onNewChat
}: ChatSidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-[#0f0f11] md:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <h2 className="text-sm font-semibold tracking-wide">
          KubeChat
        </h2>
      </div>

      <div className="shrink-0 p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-[#18181b] px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          <Plus size={18} />
          New chat
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3">
        <p className="px-2 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Chats
        </p>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg bg-muted px-3 py-2.5 text-left text-sm"
        >
          <MessageSquare size={17} />

          <span className="truncate">
            Current conversation
          </span>
        </button>
      </div>
    </aside>
  )
}
