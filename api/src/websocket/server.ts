import { IncomingMessage } from 'http'
import { RawData, WebSocket, WebSocketServer } from 'ws'

import {
  initializeRedisPubSub,
  MessageCreatedEvent,
  publishMessageCreated,
  refreshConversationNodeLease,
  registerConversationNode,
  unregisterConversationNode,
} from '../db/redisPubSub'
import { getUserIdFromCookieHeader } from '../features/auth/session'
import { conversationService } from '../features/conversations/service'
import { messageService } from '../features/messages/service'
import { createMessageSchema } from '../features/messages/validation'

import { WebSocketConnectionManager } from './connections'

import { ClientMessage, ServerMessage } from './protocol'

const websocketPath = '/ws'

const connectionManager = new WebSocketConnectionManager()

let leaseRefreshInterval: ReturnType<typeof setInterval> | null = null

function send(socket: WebSocket, message: ServerMessage): void {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  }
}

function sendError(
  socket: WebSocket,
  code: string,
  message: string,
  clientMessageId?: string,
): void {
  send(socket, {
    type: 'error',
    code,
    message,
    clientMessageId,
  })
}

function parseMessage(data: RawData): ClientMessage | null {
  try {
    const message = JSON.parse(data.toString())

    if (!message || typeof message.type !== 'string') {
      return null
    }

    return message as ClientMessage
  } catch {
    return null
  }
}

function handleMessageCreatedEvent(event: MessageCreatedEvent): void {
  const serverMessage: ServerMessage = {
    type: 'message.created',

    message: event.payload.message,

    clientMessageId: event.payload.clientMessageId,
  }

  connectionManager.broadcast(event.payload.conversationId, JSON.stringify(serverMessage))
}

async function handleMessage(
  socket: WebSocket,
  userId: string,
  message: ClientMessage,
): Promise<void> {
  if (message.type === 'conversation.subscribe') {
    const canAccess = await conversationService.canAccessConversation(
      message.conversationId,
      userId,
    )

    if (!canAccess) {
      sendError(socket, 'FORBIDDEN', 'You do not have access to this conversation')

      return
    }

    const firstLocalSubscriber = connectionManager.subscribe(message.conversationId, socket)

    if (firstLocalSubscriber) {
      await registerConversationNode(message.conversationId)
    }

    send(socket, {
      type: 'conversation.subscribed',

      conversationId: message.conversationId,
    })

    return
  }

  if (message.type === 'conversation.unsubscribe') {
    const lastLocalSubscriber = connectionManager.unsubscribe(message.conversationId, socket)

    if (lastLocalSubscriber) {
      await unregisterConversationNode(message.conversationId)
    }

    send(socket, {
      type: 'conversation.unsubscribed',

      conversationId: message.conversationId,
    })

    return
  }

  if (message.type === 'message.send') {
    const canAccess = await conversationService.canAccessConversation(
      message.conversationId,
      userId,
    )

    if (!canAccess) {
      sendError(
        socket,
        'FORBIDDEN',
        'You do not have access to this conversation',
        message.clientMessageId,
      )

      return
    }

    const parsed = createMessageSchema.safeParse({
      content: message.content,
    })

    if (!parsed.success) {
      sendError(
        socket,
        'VALIDATION_ERROR',
        parsed.error.issues[0]?.message ?? 'Invalid message',
        message.clientMessageId,
      )

      return
    }

    const createdMessage = await messageService.createMessage(message.conversationId, userId, {
      content: parsed.data.content,
    })

    await publishMessageCreated(message.conversationId, createdMessage, message.clientMessageId)
  }
}

async function authenticate(request: IncomingMessage): Promise<string | null> {
  return getUserIdFromCookieHeader(request.headers.cookie)
}

async function handleSocketClose(socket: WebSocket): Promise<void> {
  const emptyConversations = connectionManager.unsubscribeAll(socket)

  await Promise.all(
    emptyConversations.map((conversationId) => unregisterConversationNode(conversationId)),
  )
}

async function refreshNodeLeases(): Promise<void> {
  const conversations = connectionManager.getSubscribedConversationIds()

  await Promise.all(
    conversations.map((conversationId) => refreshConversationNodeLease(conversationId)),
  )
}

export function createWebSocketServer(): WebSocketServer {
  const wss = new WebSocketServer({
    noServer: true,
  })

  wss.on('connection', (socket, request) => {
    void authenticate(request)
      .then((userId) => {
        if (!userId) {
          socket.close(1008, 'Authentication required')

          return
        }

        socket.on('message', (data) => {
          const message = parseMessage(data)

          if (!message) {
            sendError(socket, 'INVALID_MESSAGE', 'Invalid WebSocket message')

            return
          }

          void handleMessage(socket, userId, message).catch((error) => {
            console.error('WebSocket message error:', error)

            sendError(
              socket,
              'INTERNAL_ERROR',
              'An unexpected error occurred',
              message.type === 'message.send' ? message.clientMessageId : undefined,
            )
          })
        })

        socket.on('close', () => {
          void handleSocketClose(socket).catch((error) => {
            console.error('WebSocket close cleanup error:', error)
          })
        })
      })
      .catch((error) => {
        console.error('WebSocket authentication error:', error)

        socket.close(1011, 'Internal server error')
      })
  })

  return wss
}

export async function initializeWebSocketPubSub(): Promise<void> {
  await initializeRedisPubSub(handleMessageCreatedEvent)

  leaseRefreshInterval = setInterval(() => {
    void refreshNodeLeases().catch((error) => {
      console.error('WebSocket lease refresh error:', error)
    })
  }, 10_000)
}

export function closeWebSocketConnections(wss: WebSocketServer): void {
  if (leaseRefreshInterval) {
    clearInterval(leaseRefreshInterval)

    leaseRefreshInterval = null
  }

  for (const socket of wss.clients) {
    socket.close(1001, 'Server shutting down')
  }
}

export { websocketPath }
