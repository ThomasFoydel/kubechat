'use client'

import { useEffect, useRef } from 'react'
import type { WebSocketConnectionStatus } from '../api/chat-websocket.client'
import { getMessages } from '../api/chat.api'
import { useChatContext } from '../context/ChatProvider'
import type { Message } from '../types/conversation.types'

export interface UseChatResult {
  messages: Message[]
  connectionStatus: WebSocketConnectionStatus
  sendMessage: (content: string) => boolean
  sendError: string | null
}

export function useChat(conversationId: string | null): UseChatResult {
  const {
    messages,
    connectionStatus,
    sendMessage: sendChatMessage,
    sendError,
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
          setMessages(loadedMessages)
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
  }
}
