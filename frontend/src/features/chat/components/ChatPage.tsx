'use client'

import {
  Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { useChat } from '../hooks/useChat'
import { useConversations } from '../hooks/useConversations'
import type { ConversationVisibility } from '../types/conversation.types'

import { ChatSidebar } from './ChatSidebar'
import { ConfirmationDialog } from './ConfirmationDialog'
import { EmptyChat } from './EmptyChat'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'
import { NewConversationDialog } from './NewConversationDialog'

interface ChatPageProps {
  conversationId?: string
}

export function ChatPage({
  conversationId = ''
}: ChatPageProps) {
  const router = useRouter()

  const [message, setMessage] =
    useState('')

  const [
    isNewConversationDialogOpen,
    setIsNewConversationDialogOpen
  ] = useState(false)

  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen
  ] = useState(false)

  const {
    conversations,
    isLoading: isLoadingConversations,
    createConversation,
    isCreating,
    deleteConversation,
    isDeleting
  } = useConversations()

  const {
    messages,
    connectionStatus,
    sendMessage,
    sendError
  } = useChat(
    conversationId || null
  )

  const currentConversation =
    conversations.find(
      conversation =>
        conversation.id ===
        conversationId
    )

  function handleNewChat() {
    if (isCreating) {
      return
    }

    setIsNewConversationDialogOpen(
      true
    )
  }

  async function handleCreateConversation(
    title: string,
    visibility: ConversationVisibility
  ) {
    try {
      const conversation =
        await createConversation(
          title,
          visibility
        )

      setIsNewConversationDialogOpen(
        false
      )

      router.push(
        `/chat/${conversation.id}`
      )
    } catch (error) {
      console.error(
        'Failed to create conversation:',
        error
      )
    }
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const content = message.trim()

    if (!content || !conversationId) {
      return
    }

    const sent = sendMessage(content)

    if (sent) {
      setMessage('')
    }
  }

  async function handleDeleteConversation() {
    if (
      !conversationId ||
      !currentConversation?.isAdmin ||
      isDeleting
    ) {
      return
    }

    try {
      await deleteConversation(
        conversationId
      )

      setIsDeleteDialogOpen(false)

      router.push('/chat')
    } catch (error) {
      console.error(
        'Failed to delete conversation:',
        error
      )
    }
  }

  const hasConversation =
    Boolean(conversationId)

  const isConnected =
    connectionStatus === 'connected'

  return (
    <>
      <div className="flex h-full min-h-0 bg-background text-foreground">
        <ChatSidebar
          conversations={conversations}
          selectedConversationId={
            conversationId || null
          }
          selectedConversation={
            currentConversation ?? null
          }
          onNewChat={handleNewChat}
          isCreating={isCreating}
          isLoading={
            isLoadingConversations
          }
        />

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
            <div className="min-w-0">
              {currentConversation && (
                <h1 className="truncate text-sm font-semibold">
                  {currentConversation.title ??
                    'New conversation'}
                </h1>
              )}
            </div>

            <div className="flex items-center gap-4">
              {currentConversation?.isAdmin && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setIsDeleteDialogOpen(
                      true
                    )
                  }
                  disabled={isDeleting}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 />
                  Delete
                </Button>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${
                    connectionStatus ===
                    'connected'
                      ? 'bg-green-500'
                      : connectionStatus ===
                        'error'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                  }`}
                />

                <span>
                  {connectionStatus ===
                    'connected'
                    ? 'Connected'
                    : connectionStatus ===
                      'reconnecting'
                      ? 'Reconnecting...'
                      : connectionStatus ===
                        'connecting'
                        ? 'Connecting...'
                        : connectionStatus ===
                          'error'
                          ? 'Connection error'
                          : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          <section className="min-h-0 flex-1 overflow-y-auto p-4">
            {hasConversation ? (
              <MessageList
                messages={messages}
              />
            ) : (
              <EmptyChat />
            )}
          </section>

          <MessageComposer
            message={message}
            onMessageChange={setMessage}
            onSubmit={handleSubmit}
            disabled={
              !conversationId ||
              !isConnected
            }
            error={sendError}
          />
        </section>
      </div>

      <NewConversationDialog
        open={
          isNewConversationDialogOpen
        }
        onClose={() =>
          setIsNewConversationDialogOpen(
            false
          )
        }
        onSubmit={
          handleCreateConversation
        }
        isCreating={isCreating}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete conversation?"
        description="This will permanently delete the conversation and all of its messages. This action cannot be undone."
        confirmLabel="Delete conversation"
        cancelLabel="Cancel"
        onConfirm={
          handleDeleteConversation
        }
        onCancel={() =>
          setIsDeleteDialogOpen(false)
        }
        isConfirming={isDeleting}
      />
    </>
  )
}
