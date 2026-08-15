'use client'

import { Activity, LayoutDashboard, LogOut, MessageSquare, Plus, Users, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuth } from '@/features/auth'
import { NewConversationDialog } from '@/features/chat/components/NewConversationDialog'
import { useConversations } from '@/features/chat/hooks/useConversations'
import type { ConversationVisibility } from '@/features/chat/types/conversation.types'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Health',
    href: '/health',
    icon: Activity,
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)

  const { logout, isLoggingOut } = useAuth()

  const { conversations, createConversation, isCreating } = useConversations()

  const currentConversationId = pathname.startsWith('/chat/') ? pathname.split('/')[2] : null

  const currentConversation = conversations.find(
    (conversation) => conversation.id === currentConversationId,
  )

  async function handleLogout() {
    await logout()
    router.replace('/login')
  }

  function handleNewChat() {
    if (isCreating) {
      return
    }

    setIsNewConversationOpen(true)
  }

  async function handleCreateConversation(title: string, visibility: ConversationVisibility) {
    try {
      const conversation = await createConversation(title, visibility)

      setIsNewConversationOpen(false)
      onClose()

      router.push(`/chat/${conversation.id}`)
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  function handleConversationSelect(conversationId: string) {
    onClose()

    router.push(`/chat/${conversationId}`)
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-border bg-[#0f0f11]
          shadow-2xl transition-transform duration-200
          md:static md:z-auto md:w-64 md:translate-x-0 md:shadow-none
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
          <h2 className="text-lg font-semibold">KubeChat</h2>

          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition hover:bg-muted"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border px-4 py-4 md:hidden">
            <div className="mb-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Conversation
                </p>

                <p className="mt-1 truncate px-2 text-sm font-medium">
                  {currentConversation?.title ?? 'No conversation selected'}
                </p>
              </div>

              <button
                type="button"
                aria-label="New chat"
                onClick={handleNewChat}
                disabled={isCreating}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={17} />
              </button>
            </div>

            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => handleConversationSelect(conversation.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    currentConversationId === conversation.id ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                >
                  <MessageSquare size={17} />

                  <span className="truncate">{conversation.title ?? 'New conversation'}</span>
                </button>
              ))}

              {conversations.length === 0 && (
                <p className="px-2 py-2 text-xs text-muted-foreground">No conversations yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-border p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />

            {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </aside>

      <NewConversationDialog
        open={isNewConversationOpen}
        onClose={() => setIsNewConversationOpen(false)}
        onSubmit={handleCreateConversation}
        isCreating={isCreating}
      />
    </>
  )
}
