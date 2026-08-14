'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type {
  ConversationVisibility
} from '../types/conversation.types'

import { useChat } from '../hooks/useChat'
import { useConversations } from '../hooks/useConversations'

import { ChatSidebar } from './ChatSidebar'
import { EmptyChat } from './EmptyChat'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'
import {
  NewConversationDialog
} from './NewConversationDialog'

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
    isNewConversationOpen,
    setIsNewConversationOpen
  ] = useState(false)

  const {
    conversations,
    isLoading: isLoadingConversations,
    createConversation,
    isCreating
  } = useConversations()

  const {
    messages,
    connectionStatus,
    sendMessage,
    sendError
  } = useChat(
    conversationId || null
  )

  function handleNewChat() {
    if (isCreating) {
      return
    }

    setIsNewConversationOpen(true)
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

      setIsNewConversationOpen(false)

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

  const hasConversation =
    Boolean(conversationId)

  const isConnected =
    connectionStatus === 'connected'

  const selectedConversation =
    conversations.find(
      conversation =>
        conversation.id ===
        conversationId
    )

  return (
    <>
      <div className="flex h-full min-h-0 bg-background text-foreground">
        <ChatSidebar
          conversations={conversations}
          selectedConversationId={
            conversationId || null
          }
          selectedConversation={
            selectedConversation ?? null
          }
          onNewChat={handleNewChat}
          isCreating={isCreating}
          isLoading={
            isLoadingConversations
          }
        />

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center justify-end border-b border-border px-4">
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
        open={isNewConversationOpen}
        onClose={() =>
          setIsNewConversationOpen(false)
        }
        onSubmit={
          handleCreateConversation
        }
        isCreating={isCreating}
      />
    </>
  )
}
