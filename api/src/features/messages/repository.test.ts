import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../db/prisma', () => ({
  prisma: {
    message: {
      findMany: vi.fn(),
    },
  },
}))

import { prisma } from '../../db/prisma'
import { messageRepository } from './repository'

describe('messageRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMessagesByConversationId', () => {
    it('loads at most the 100 most recent messages', async () => {
      const messages = Array.from({ length: 100 }, (_, index) => ({
        id: `message-${index}`,
        content: `Message ${index}`,
        createdAt: new Date(2026, 0, index + 1),
        conversationId: 'conversation-123',
        userId: 'user-123',
      }))

      vi.mocked(prisma.message.findMany).mockResolvedValue(messages as never)

      const result = await messageRepository.getMessagesByConversationId('conversation-123')

      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: {
          conversationId: 'conversation-123',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 100,
      })

      expect(result).toHaveLength(100)
    })

    it('returns the messages in chronological order', async () => {
      const newestFirst = [
        {
          id: 'message-3',
          content: 'Third',
          createdAt: new Date('2026-01-03'),
          conversationId: 'conversation-123',
          userId: 'user-123',
        },
        {
          id: 'message-2',
          content: 'Second',
          createdAt: new Date('2026-01-02'),
          conversationId: 'conversation-123',
          userId: 'user-123',
        },
        {
          id: 'message-1',
          content: 'First',
          createdAt: new Date('2026-01-01'),
          conversationId: 'conversation-123',
          userId: 'user-123',
        },
      ]

      vi.mocked(prisma.message.findMany).mockResolvedValue(newestFirst as never)

      const result = await messageRepository.getMessagesByConversationId('conversation-123')

      expect(result.map((message) => message.id)).toEqual(['message-1', 'message-2', 'message-3'])
    })

    it('returns fewer than 100 messages when fewer exist', async () => {
      const messages = [
        {
          id: 'message-1',
          content: 'Hello',
          createdAt: new Date('2026-01-01'),
          conversationId: 'conversation-123',
          userId: 'user-123',
        },
      ]

      vi.mocked(prisma.message.findMany).mockResolvedValue(messages as never)

      const result = await messageRepository.getMessagesByConversationId('conversation-123')

      expect(result).toHaveLength(1)
    })
  })
})
