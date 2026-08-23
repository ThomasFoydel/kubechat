'use client'

import { useEffect, useRef } from 'react'
import type { WebSocketConnectionStatus } from '../api/chat-websocket.client'
import { getMessages } from '../api/chat.api'
import { useChatContext } from '../context/ChatProvider'
import type { Message } from '@kubechat/contracts'

export interface UseChatResult {
  messages: Message[]
  connectionStatus: WebSocketConnectionStatus
  sendMessage: (content: string) => boolean
  sendError: string | null
  isSubscribed: boolean
}

export function useChat(conversationId: string | null): UseChatResult {
  const {
    messages,
    connectionStatus,
    sendMessage: sendChatMessage,
    sendError,
    subscribedConversations,
    subscribe,
    unsubscribe,
    setMessages,
    clearSendError,
  } = useChatContext()

  const conversationIdRef = useRef<string | null>(conversationId)

  useEffect(() => {
    conversationIdRef.current = conversationId
  }, [conversationId])

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      clearSendError()

      return
    }

    let cancelled = false

    setMessages([])
    clearSendError()

    subscribe(conversationId)

    getMessages(conversationId)
      .then((loadedMessages) => {
        if (!cancelled) {
          setMessages((currentMessages) => {
            const messagesById = new Map(
              loadedMessages.map((message) => [message.id, message]),
            )

            for (const message of currentMessages) {
              messagesById.set(message.id, message)
            }

            return Array.from(messagesById.values()).sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            )
          })
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to load messages:', error)
        }
      })

    return () => {
      cancelled = true

      unsubscribe(conversationId)
    }
  }, [conversationId, subscribe, unsubscribe, setMessages, clearSendError])

  function sendMessage(content: string): boolean {
    const activeConversationId = conversationIdRef.current

    if (!activeConversationId) {
      return false
    }

    return sendChatMessage(activeConversationId, content)
  }

  return {
    messages,
    connectionStatus,
    sendMessage,
    sendError,
    isSubscribed: conversationId ? subscribedConversations.has(conversationId) : false,
  }
}
