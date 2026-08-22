'use client'

import { useEffect, useRef } from 'react'

import { useAuth } from '@/features/auth/hooks/useAuth'

import type { Message } from '@kubechat/contracts'

interface MessageListProps {
  messages: Message[]
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function MessageList({ messages }: MessageListProps) {
  const { user } = useAuth()

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No messages yet</p>

          <p className="mt-1 text-xs text-muted-foreground/70">
            Send a message to start the conversation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      {messages.map((message) => {
        const isOwnMessage = message.userId === user?.id

        return (
          <article
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                isOwnMessage
                  ? 'rounded-br-md bg-primary text-primary-foreground'
                  : 'rounded-bl-md bg-card'
              }`}
            >
              {!isOwnMessage && (
                <p className="mb-1 text-xs font-medium text-muted-foreground">{message.username}</p>
              )}

              <p className="whitespace-pre-wrap text-sm">{message.content}</p>

              <p
                className={`mt-1 text-[10px] ${
                  isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}
              >
                {formatTimestamp(message.createdAt)}
              </p>
            </div>
          </article>
        )
      })}

      <div ref={bottomRef} />
    </div>
  )
}
