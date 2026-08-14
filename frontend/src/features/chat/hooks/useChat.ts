'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import {
  ChatWebSocketClient,
  type WebSocketConnectionStatus
} from '../api/chat-websocket.client'

import { getMessages } from '../api/chat.api'

import type { Message } from '../types/conversation.types'

export interface UseChatResult {
  messages: Message[]
  connectionStatus: WebSocketConnectionStatus
  sendMessage: (
    content: string
  ) => boolean
  sendError: string | null
}

export function useChat(
  conversationId: string | null
): UseChatResult {
  const [messages, setMessages] =
    useState<Message[]>([])

  const [
    connectionStatus,
    setConnectionStatus
  ] =
    useState<WebSocketConnectionStatus>(
      'disconnected'
    )

  const [sendError, setSendError] =
    useState<string | null>(null)

  const clientRef =
    useRef<ChatWebSocketClient | null>(
      null
    )

  const conversationIdRef =
    useRef<string | null>(
      conversationId
    )

  useEffect(() => {
    conversationIdRef.current =
      conversationId
  }, [conversationId])

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      setSendError(null)

      return
    }

    let cancelled = false

    setMessages([])
    setSendError(null)

    getMessages(conversationId)
      .then(messages => {
        if (!cancelled) {
          setMessages(messages)
        }
      })
      .catch(error => {
        if (!cancelled) {
          console.error(
            'Failed to load messages:',
            error
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [conversationId])

  useEffect(() => {
    const client =
      new ChatWebSocketClient({
        onMessage: message => {
          if (
            message.type ===
            'message.created'
          ) {
            if (
              message.message.conversationId !==
              conversationIdRef.current
            ) {
              return
            }

            setSendError(null)

            setMessages(current => {
              const exists =
                current.some(
                  existing =>
                    existing.id ===
                    message.message.id
                )

              if (exists) {
                return current
              }

              return [
                ...current,
                message.message
              ]
            })
          }

          if (
            message.type === 'error'
          ) {
            if (
              message.clientMessageId
            ) {
              setSendError(
                message.message
              )
            }

            console.error(
              'WebSocket error:',
              message.code,
              message.message
            )
          }
        },

        onStatusChange:
          setConnectionStatus
      })

    clientRef.current = client

    client.connect()

    return () => {
      client.disconnect()
      clientRef.current = null
    }
  }, [])

  useEffect(() => {
    const client =
      clientRef.current

    if (!client || !conversationId) {
      return
    }

    client.subscribe(
      conversationId
    )

    return () => {
      client.unsubscribe(
        conversationId
      )
    }
  }, [conversationId])

  const sendMessage = useCallback(
    (content: string): boolean => {
      const activeConversationId =
        conversationIdRef.current

      if (!activeConversationId) {
        setSendError(
          'No conversation is selected.'
        )

        return false
      }

      const client =
        clientRef.current

      if (!client) {
        setSendError(
          'Chat connection is not ready.'
        )

        return false
      }

      if (
        connectionStatus !==
        'connected'
      ) {
        setSendError(
          'Chat connection is not ready.'
        )

        return false
      }

      const clientMessageId =
        crypto.randomUUID()

      setSendError(null)

      try {
        client.sendMessage(
          activeConversationId,
          content,
          clientMessageId
        )

        return true
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to send message'

        setSendError(message)

        return false
      }
    },
    [connectionStatus]
  )

  return {
    messages,
    connectionStatus,
    sendMessage,
    sendError
  }
}
