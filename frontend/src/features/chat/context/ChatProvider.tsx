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

import {
  ChatWebSocketClient,
  type WebSocketConnectionStatus,
} from '../api/chat-websocket.client'

import type { Message, UserPresence } from '@kubechat/contracts'

interface ChatContextValue {
  messages: Message[]
  connectionStatus: WebSocketConnectionStatus
  sendMessage: (conversationId: string, content: string) => boolean
  sendError: string | null
  subscribedConversations: Set<string>
  subscribe: (conversationId: string) => void
  unsubscribe: (conversationId: string) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  clearSendError: () => void
  presenceByUserId: Record<string, UserPresence>
  setUserPresence: (userId: string, presence: UserPresence) => void
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

  const [subscribedConversations, setSubscribedConversations] =
    useState<Set<string>>(new Set())

  const [presenceByUserId, setPresenceByUserId] =
    useState<Record<string, UserPresence>>({})

  const clientRef = useRef<ChatWebSocketClient | null>(null)

  const requestedSubscriptionsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    let active = true

    const client = new ChatWebSocketClient({
      onConversationSubscribed: (conversationId) => {
        if (!active) {
          return
        }

        setSubscribedConversations((current) => {
          const next = new Set(current)
          next.add(conversationId)

          return next
        })
      },

      onMessage: (message) => {
        if (!active) {
          return
        }

        if (message.type === 'message.created') {
          setSendError(null)

          setMessages((current) => {
            const exists = current.some(
              (existing) => existing.id === message.message.id,
            )

            if (exists) {
              return current
            }

            return [...current, message.message]
          })
        }

        if (message.type === 'presence.changed') {
          setPresenceByUserId((current) => ({
            ...current,
            [message.userId]: {
              online: message.online,
              nodes: message.nodes,
            },
          }))
        }

        if (message.type === 'error') {
          if (message.clientMessageId) {
            setSendError(message.message)
          }

          console.error(
            'WebSocket error:',
            message.code,
            message.message,
          )
        }
      },

      onStatusChange: (status) => {
        if (!active) {
          return
        }

        if (status !== 'connected') {
          setSubscribedConversations(new Set())
        }

        setConnectionStatus(status)
      },
    })

    clientRef.current = client

    for (const conversationId of requestedSubscriptionsRef.current) {
      client.subscribe(conversationId)
    }

    client.connect()

    return () => {
      active = false

      client.disconnect()

      setSubscribedConversations(new Set())

      if (clientRef.current === client) {
        clientRef.current = null
      }
    }
  }, [])

  const subscribe = useCallback((conversationId: string) => {
    requestedSubscriptionsRef.current.add(conversationId)

    setSubscribedConversations((current) => {
      const next = new Set(current)
      next.delete(conversationId)

      return next
    })

    clientRef.current?.subscribe(conversationId)
  }, [])

  const unsubscribe = useCallback((conversationId: string) => {
    requestedSubscriptionsRef.current.delete(conversationId)

    setSubscribedConversations((current) => {
      const next = new Set(current)
      next.delete(conversationId)

      return next
    })

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

      if (!subscribedConversations.has(conversationId)) {
        setSendError('Chat subscription is not ready.')

        return false
      }

      const clientMessageId = crypto.randomUUID()

      setSendError(null)

      try {
        client.sendMessage(
          conversationId,
          content,
          clientMessageId,
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
    [connectionStatus, subscribedConversations],
  )

  const clearSendError = useCallback(() => {
    setSendError(null)
  }, [])

  const setUserPresence = useCallback(
    (userId: string, presence: UserPresence) => {
      setPresenceByUserId((current) => ({
        ...current,
        [userId]: presence,
      }))
    },
    [],
  )

  return (
    <ChatContext.Provider
      value={{
        messages,
        connectionStatus,
        sendMessage,
        sendError,
        subscribedConversations,
        subscribe,
        unsubscribe,
        setMessages,
        clearSendError,
        presenceByUserId,
        setUserPresence,
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
