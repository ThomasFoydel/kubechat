'use client'

import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { getPublicConversations } from '../api/chat.api'

import type { Conversation } from '../types/conversation.types'

interface PublicConversationDialogProps {
  open: boolean
  onClose: () => void
  onJoin: (conversationId: string) => Promise<Conversation>
  isJoining: boolean
}

export function PublicConversationDialog({
  open,
  onClose,
  onJoin,
  isJoining,
}: PublicConversationDialogProps) {
  const [search, setSearch] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setSearch('')
      setConversations([])
      setIsLoading(false)
      setHasSearched(false)
      setError(null)

      return
    }

    const trimmedSearch = search.trim()

    if (!trimmedSearch) {
      setConversations([])
      setIsLoading(false)
      setHasSearched(false)
      setError(null)

      return
    }

    setIsLoading(true)
    setHasSearched(false)
    setError(null)

    const timeout = window.setTimeout(() => {
      getPublicConversations(trimmedSearch)
        .then((results) => {
          setConversations(results)
          setHasSearched(true)
        })
        .catch((requestError) => {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to search public conversations',
          )
          setHasSearched(true)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }, 500)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [open, search])

  if (!open) {
    return null
  }

  async function handleJoin(conversationId: string) {
    try {
      await onJoin(conversationId)
      onClose()
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : 'Failed to join conversation')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="public-conversations-title"
        className="flex h-[32rem] max-h-[80vh] w-full max-w-lg flex-col rounded-xl border border-border bg-[#18181b] p-6 text-white shadow-xl"
      >
        <div className="mb-5">
          <h2 id="public-conversations-title" className="text-lg font-semibold">
            Join a public conversation
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Search for a public conversation to join.
          </p>
        </div>

        <div className="relative mb-4">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            autoFocus
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-10 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />

          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Searching...</p>
          ) : error ? (
            <p className="py-8 text-center text-sm text-destructive">{error}</p>
          ) : hasSearched && conversations.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No public conversations found.
            </p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-white/5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {conversation.title ?? 'New conversation'}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">Public conversation</p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleJoin(conversation.id)}
                    disabled={isJoining}
                    className="cursor-pointer transition-colors hover:bg-white/20"
                  >
                    {isJoining ? 'Joining...' : 'Join'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isJoining}
            className="cursor-pointer transition-colors hover:bg-white/10"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
