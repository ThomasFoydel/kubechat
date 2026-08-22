'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { ChatWebSocketClient, type WebSocketConnectionStatus } from '../api/chat-websocket.client'

import type { Message } from '@kubechat/contracts'

interface ChatContextValue {
  messages: Message[]
  connectionStatus: WebSocketConnectionStatus
  sendMessage: (conversationId: string, content: string) => boolean
  sendError: string | null
  subscribe: (conversationId: string) => void
  unsubscribe: (conversationId: string) => void
  setMessages: (messages: Message[]) => void
  clearSendError: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

interface ChatProviderProps {
  children: ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>([])

  const [connectionStatus, setConnectionStatus] =
    useState<WebSocketConnectionStatus>('disconnected')

  const [sendError, setSendError] = useState<string | null>(null)

  const clientRef = useRef<ChatWebSocketClient | null>(null)

  useEffect(() => {
    let active = true

    const client = new ChatWebSocketClient({
      onMessage: (message) => {
        if (!active) {
          return
        }

        if (message.type === 'message.created') {
          setSendError(null)

          setMessages((current) => {
            const exists = current.some((existing) => existing.id === message.message.id)

            if (exists) {
              return current
            }

            return [...current, message.message]
          })
        }

        if (message.type === 'error') {
          if (message.clientMessageId) {
            setSendError(message.message)
          }

          console.error('WebSocket error:', message.code, message.message)
        }
      },

      onStatusChange: (status) => {
        if (!active) {
          return
        }

        setConnectionStatus(status)
      },
    })

    clientRef.current = client

    client.connect()

    return () => {
      active = false

      client.disconnect()

      if (clientRef.current === client) {
        clientRef.current = null
      }
    }
  }, [])

  const subscribe = useCallback((conversationId: string) => {
    clientRef.current?.subscribe(conversationId)
  }, [])

  const unsubscribe = useCallback((conversationId: string) => {
    clientRef.current?.unsubscribe(conversationId)
  }, [])

  const sendMessage = useCallback(
    (conversationId: string, content: string): boolean => {
      const client = clientRef.current

      if (!client) {
        setSendError('Chat connection is not ready.')

        return false
      }

      if (connectionStatus !== 'connected') {
        setSendError('Chat connection is not ready.')

        return false
      }

      const clientMessageId = crypto.randomUUID()

      setSendError(null)

      try {
        client.sendMessage(conversationId, content, clientMessageId)

        return true
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send message'

        setSendError(message)

        return false
      }
    },
    [connectionStatus],
  )

  const clearSendError = useCallback(() => {
    setSendError(null)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages,
        connectionStatus,
        sendMessage,
        sendError,
        subscribe,
        unsubscribe,
        setMessages,
        clearSendError,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChatContext must be used inside ChatProvider')
  }

  return context
}
