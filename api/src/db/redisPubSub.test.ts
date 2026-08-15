import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const createClient = vi.fn()

  const publisher = {
    isOpen: false,
    connect: vi.fn(),
    on: vi.fn(),
    publish: vi.fn(),
    zAdd: vi.fn(),
    zRem: vi.fn(),
    zRemRangeByScore: vi.fn(),
    zRangeByScore: vi.fn(),
    quit: vi.fn(),
  }

  const subscriber = {
    isOpen: false,
    connect: vi.fn(),
    on: vi.fn(),
    subscribe: vi.fn(),
    quit: vi.fn(),
  }

  createClient.mockReturnValueOnce(publisher).mockReturnValueOnce(subscriber)

  return {
    createClient,
    publisher,
    subscriber,
  }
})

vi.hoisted(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

  process.env.REDIS_URL = 'redis://localhost:6379'

  process.env.SESSION_SECRET = 'test-session-secret'

  process.env.WEBSOCKET_NODE_ID = 'test-node-1'
})

vi.mock('redis', () => ({
  createClient: mocks.createClient,
}))

import {
  disconnectRedisPubSub,
  getConversationNodes,
  initializeRedisPubSub,
  publishMessageCreated,
  refreshConversationNodeLease,
  registerConversationNode,
  unregisterConversationNode,
} from './redisPubSub'

describe('redisPubSub', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.publisher.isOpen = false
    mocks.subscriber.isOpen = false

    mocks.publisher.zRangeByScore.mockResolvedValue([])

    mocks.publisher.zRemRangeByScore.mockResolvedValue(0)

    mocks.publisher.zAdd.mockResolvedValue(1)
    mocks.publisher.zRem.mockResolvedValue(1)
    mocks.publisher.publish.mockResolvedValue(1)
    mocks.publisher.connect.mockResolvedValue(undefined)
    mocks.publisher.quit.mockResolvedValue(undefined)

    mocks.subscriber.connect.mockResolvedValue(undefined)

    mocks.subscriber.quit.mockResolvedValue(undefined)

    mocks.subscriber.subscribe.mockResolvedValue(undefined)
  })

  describe('initializeRedisPubSub', () => {
    it('connects publisher and subscriber and subscribes to the node channel', async () => {
      await initializeRedisPubSub(vi.fn())

      expect(mocks.publisher.connect).toHaveBeenCalledTimes(1)

      expect(mocks.subscriber.connect).toHaveBeenCalledTimes(1)

      expect(mocks.subscriber.subscribe).toHaveBeenCalledWith(
        'kubechat:websocket:node:test-node-1',
        expect.any(Function),
      )
    })
  })

  describe('conversation node registration', () => {
    it('registers the current node for a conversation', async () => {
      await registerConversationNode('conversation-123')

      expect(mocks.publisher.zAdd).toHaveBeenCalledWith(
        'kubechat:websocket:conversation:conversation-123:nodes',
        {
          score: expect.any(Number),
          value: 'test-node-1',
        },
      )
    })

    it('refreshes the current node lease', async () => {
      await refreshConversationNodeLease('conversation-123')

      expect(mocks.publisher.zAdd).toHaveBeenCalledWith(
        'kubechat:websocket:conversation:conversation-123:nodes',
        {
          score: expect.any(Number),
          value: 'test-node-1',
        },
      )
    })

    it('unregisters the current node for a conversation', async () => {
      await unregisterConversationNode('conversation-123')

      expect(mocks.publisher.zRem).toHaveBeenCalledWith(
        'kubechat:websocket:conversation:conversation-123:nodes',
        'test-node-1',
      )
    })
  })

  describe('getConversationNodes', () => {
    it('removes expired nodes before returning active nodes', async () => {
      mocks.publisher.zRangeByScore.mockResolvedValue(['node-1', 'node-2'])

      const result = await getConversationNodes('conversation-123')

      expect(mocks.publisher.zRemRangeByScore).toHaveBeenCalledWith(
        'kubechat:websocket:conversation:conversation-123:nodes',
        0,
        expect.any(Number),
      )

      expect(mocks.publisher.zRangeByScore).toHaveBeenCalledWith(
        'kubechat:websocket:conversation:conversation-123:nodes',
        expect.any(Number),
        '+inf',
      )

      expect(result).toEqual(['node-1', 'node-2'])
    })
  })

  describe('publishMessageCreated', () => {
    it('publishes the event only to nodes subscribed to the conversation', async () => {
      mocks.publisher.zRangeByScore.mockResolvedValue(['node-1', 'node-2'])

      const message = {
        id: 'message-123',
        conversationId: 'conversation-123',
        userId: 'user-123',
        content: 'Hello',
        createdAt: '2026-08-14T00:00:00.000Z',
      }

      await publishMessageCreated('conversation-123', message)

      expect(mocks.publisher.publish).toHaveBeenCalledTimes(2)

      expect(mocks.publisher.publish).toHaveBeenCalledWith(
        'kubechat:websocket:node:node-1',
        expect.any(String),
      )

      expect(mocks.publisher.publish).toHaveBeenCalledWith(
        'kubechat:websocket:node:node-2',
        expect.any(String),
      )
    })

    it('does not publish when no nodes are subscribed', async () => {
      mocks.publisher.zRangeByScore.mockResolvedValue([])

      const message = {
        id: 'message-123',
        conversationId: 'conversation-123',
        userId: 'user-123',
        content: 'Hello',
        createdAt: '2026-08-14T00:00:00.000Z',
      }

      await publishMessageCreated('conversation-123', message)

      expect(mocks.publisher.publish).not.toHaveBeenCalled()
    })

    it('publishes a structured message.created event', async () => {
      mocks.publisher.zRangeByScore.mockResolvedValue(['node-1'])

      const message = {
        id: 'message-123',
        conversationId: 'conversation-123',
        userId: 'user-123',
        content: 'Hello',
        createdAt: '2026-08-14T00:00:00.000Z',
      }

      await publishMessageCreated('conversation-123', message, 'client-message-123')

      const [, serializedEvent] = mocks.publisher.publish.mock.calls[0]

      const event = JSON.parse(serializedEvent)

      expect(event).toEqual({
        eventId: expect.any(String),
        eventType: 'message.created',
        version: 1,
        occurredAt: expect.any(String),
        payload: {
          conversationId: 'conversation-123',
          message,
          clientMessageId: 'client-message-123',
        },
      })
    })
  })

  describe('disconnectRedisPubSub', () => {
    it('disconnects both Redis clients', async () => {
      mocks.publisher.isOpen = true
      mocks.subscriber.isOpen = true

      await disconnectRedisPubSub()

      expect(mocks.subscriber.quit).toHaveBeenCalledTimes(1)

      expect(mocks.publisher.quit).toHaveBeenCalledTimes(1)
    })
  })
})
