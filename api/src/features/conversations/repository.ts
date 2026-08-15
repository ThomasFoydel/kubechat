import { Conversation } from '../../../generated/prisma'
import { prisma } from '../../db/prisma'

async function createConversation(
  userId: string,
  title?: string,
  visibility: 'PUBLIC' | 'PRIVATE' = 'PRIVATE',
): Promise<Conversation> {
  return prisma.conversation.create({
    data: {
      title: title ?? null,
      visibility,
      members: {
        create: {
          userId,
          role: 'OWNER',
        },
      },
    },
  })
}

async function getConversationById(id: string): Promise<Conversation | null> {
  return prisma.conversation.findUnique({
    where: {
      id,
    },
  })
}

async function getConversationsByUserId(userId: string): Promise<Conversation[]> {
  return prisma.conversation.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

async function isMember(conversationId: string, userId: string): Promise<boolean> {
  const membership = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  })

  return membership !== null
}

async function isAdmin(conversationId: string, userId: string): Promise<boolean> {
  const membership = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  })

  return membership?.role === 'OWNER' || membership?.role === 'ADMIN'
}

async function updateConversation(
  id: string,
  title: string | null,
  visibility?: 'PUBLIC' | 'PRIVATE',
): Promise<Conversation> {
  return prisma.conversation.update({
    where: {
      id,
    },
    data: {
      title,
      ...(visibility !== undefined ? { visibility } : {}),
    },
  })
}

async function deleteConversation(id: string): Promise<void> {
  await prisma.conversation.delete({
    where: {
      id,
    },
  })
}

export const conversationRepository = {
  createConversation,
  getConversationById,
  getConversationsByUserId,
  isMember,
  isAdmin,
  updateConversation,
  deleteConversation,
}
