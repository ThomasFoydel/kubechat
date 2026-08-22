import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../db/prisma', () => ({
  prisma: {
    conversation: {
      findMany: vi.fn(),
    },
  },
}))

import { prisma } from '../../db/prisma'
import { conversationRepository } from './repository'

describe('conversationRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPublicConversations', () => {
    it('loads public conversations without a search term', async () => {
      const conversations = [
        {
          id: 'conversation-1',
          title: 'First public conversation',
          visibility: 'PUBLIC',
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-02'),
        },
      ]

      vi.mocked(prisma.conversation.findMany).mockResolvedValue(conversations as never)

      const result = await conversationRepository.getPublicConversations()

      expect(prisma.conversation.findMany).toHaveBeenCalledWith({
        where: {
          visibility: 'PUBLIC',
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 50,
      })

      expect(result).toEqual(conversations)
    })

    it('searches public conversations by title case-insensitively', async () => {
      const conversations = [
        {
          id: 'conversation-1',
          title: 'Kubernetes Help',
          visibility: 'PUBLIC',
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-02'),
        },
      ]

      vi.mocked(prisma.conversation.findMany).mockResolvedValue(conversations as never)

      const result = await conversationRepository.getPublicConversations('kubernetes')

      expect(prisma.conversation.findMany).toHaveBeenCalledWith({
        where: {
          visibility: 'PUBLIC',
          title: {
            contains: 'kubernetes',
            mode: 'insensitive',
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 50,
      })

      expect(result).toEqual(conversations)
    })

    it('limits results to 50 conversations', async () => {
      const conversations = Array.from({ length: 50 }, (_, index) => ({
        id: `conversation-${index}`,
        title: `Conversation ${index}`,
        visibility: 'PUBLIC',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-02'),
      }))

      vi.mocked(prisma.conversation.findMany).mockResolvedValue(conversations as never)

      const result = await conversationRepository.getPublicConversations('conversation')

      expect(prisma.conversation.findMany).toHaveBeenCalledWith({
        where: {
          visibility: 'PUBLIC',
          title: {
            contains: 'conversation',
            mode: 'insensitive',
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 50,
      })

      expect(result).toHaveLength(50)
    })
  })
})
