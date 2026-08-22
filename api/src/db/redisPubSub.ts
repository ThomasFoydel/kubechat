import { MessageResponse } from '@kubechat/contracts'
import { randomUUID } from 'crypto'
import { createClient } from 'redis'
import { config } from '../config/env'

const websocketChannelPrefix = 'kubechat:websocket:node:'

const conversationNodesPrefix = 'kubechat:websocket:conversation:'

const nodeLeaseSeconds = 30

const publisher = createClient({
  url: config.redisUrl,
})

const subscriber = createClient({
  url: config.redisUrl,
})

publisher.on('error', (error) => {
  console.error('Redis publisher error:', error)
})

subscriber.on('error', (error) => {
  console.error('Redis subscriber error:', error)
})

publisher.on('reconnecting', () => {
  console.warn('Redis publisher reconnecting')
})

subscriber.on('reconnecting', () => {
  console.warn('Redis subscriber reconnecting')
})

export interface MessageCreatedEvent {
  eventId: string
  eventType: 'message.created'
  version: 1
  occurredAt: string
  payload: {
    conversationId: string
    message: MessageResponse
    clientMessageId?: string
  }
}

export type WebSocketEvent = MessageCreatedEvent

type WebSocketEventHandler = (event: WebSocketEvent) => void

function getNodeChannel(): string {
  return `${websocketChannelPrefix}${config.websocketNodeId}`
}

function getConversationNodesKey(conversationId: string): string {
  return `${conversationNodesPrefix}${conversationId}:nodes`
}

function getLeaseExpiration(): number {
  return Date.now() + nodeLeaseSeconds * 1000
}

export async function initializeRedisPubSub(handler: WebSocketEventHandler): Promise<void> {
  if (!publisher.isOpen) {
    await publisher.connect()
  }

  if (!subscriber.isOpen) {
    await subscriber.connect()
  }

  await subscriber.subscribe(getNodeChannel(), (message) => {
    try {
      const event = JSON.parse(message) as WebSocketEvent

      if (event.eventType !== 'message.created') {
        console.warn('Ignoring unknown Redis event:', event.eventType)

        return
      }

      handler(event)
    } catch (error) {
      console.error('Failed to process Redis WebSocket event:', error)
    }
  })
}

export async function registerConversationNode(conversationId: string): Promise<void> {
  await publisher.zAdd(getConversationNodesKey(conversationId), {
    score: getLeaseExpiration(),
    value: config.websocketNodeId,
  })
}

export async function unregisterConversationNode(conversationId: string): Promise<void> {
  await publisher.zRem(getConversationNodesKey(conversationId), config.websocketNodeId)
}

export async function refreshConversationNodeLease(conversationId: string): Promise<void> {
  await publisher.zAdd(getConversationNodesKey(conversationId), {
    score: getLeaseExpiration(),
    value: config.websocketNodeId,
  })
}

export async function getConversationNodes(conversationId: string): Promise<string[]> {
  const key = getConversationNodesKey(conversationId)

  const now = Date.now()

  await publisher.zRemRangeByScore(key, 0, now)

  return publisher.zRangeByScore(key, now, '+inf')
}

export async function publishMessageCreated(
  conversationId: string,
  message: MessageResponse,
  clientMessageId?: string,
): Promise<void> {
  const event: MessageCreatedEvent = {
    eventId: randomUUID(),

    eventType: 'message.created',

    version: 1,

    occurredAt: new Date().toISOString(),

    payload: {
      conversationId,
      message,
      clientMessageId,
    },
  }

  const serializedEvent = JSON.stringify(event)

  const nodes = await getConversationNodes(conversationId)

  await Promise.all(
    nodes.map((nodeId) => publisher.publish(`${websocketChannelPrefix}${nodeId}`, serializedEvent)),
  )
}

export async function disconnectRedisPubSub(): Promise<void> {
  if (subscriber.isOpen) {
    await subscriber.quit()
  }

  if (publisher.isOpen) {
    await publisher.quit()
  }
}
