'use client'

import { MessageSquare, Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { Conversation } from '@kubechat/contracts'

interface ChatSidebarProps {
  conversations: Conversation[]
  selectedConversationId: string | null
  onNewChat: () => void
  onFindPublicChats: () => void
  isCreating: boolean
  isLoading: boolean
}

export function ChatSidebar({
  conversations,
  selectedConversationId,
  onNewChat,
  onFindPublicChats,
  isCreating,
  isLoading,
}: ChatSidebarProps) {
  const router = useRouter()

  function handleSelect(conversationId: string) {
    router.push(`/chat/${conversationId}`)
  }

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-[#0f0f11] md:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <h2 className="truncate text-sm font-semibold tracking-wide">Conversations</h2>
      </div>

      <div className="shrink-0 space-y-2 p-3">
        <button
          type="button"
          onClick={onNewChat}
          disabled={isCreating}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-border bg-[#18181b] px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />

          {isCreating ? 'Creating...' : 'New chat'}
        </button>

        <button
          type="button"
          onClick={onFindPublicChats}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-border bg-[#18181b] px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
        >
          <Search size={18} />
          Find public chats
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3">
        <p className="px-2 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Chats
        </p>

        {isLoading ? (
          <p className="px-2 py-2 text-xs text-muted-foreground">Loading chats...</p>
        ) : conversations.length === 0 ? (
          <p className="px-2 py-2 text-xs text-muted-foreground">No conversations yet.</p>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => {
              const isSelected = selectedConversationId === conversation.id

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => handleSelect(conversation.id)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    isSelected ? 'bg-muted' : 'hover:bg-white/10'
                  }`}
                >
                  <MessageSquare size={17} fill={isSelected ? 'currentColor' : 'none'} />

                  <span className="truncate">{conversation.title ?? 'New conversation'}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
