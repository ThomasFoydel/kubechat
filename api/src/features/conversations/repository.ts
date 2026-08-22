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

async function getPublicConversations(search?: string): Promise<Conversation[]> {
  return prisma.conversation.findMany({
    where: {
      visibility: 'PUBLIC',
      ...(search
        ? {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 50,
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

async function addMember(conversationId: string, userId: string): Promise<void> {
  await prisma.conversationMember.upsert({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
    update: {},
    create: {
      conversationId,
      userId,
      role: 'MEMBER',
    },
  })
}

async function getMemberRole(
  conversationId: string,
  userId: string,
): Promise<'OWNER' | 'ADMIN' | 'MEMBER' | null> {
  const membership = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
    select: {
      role: true,
    },
  })

  return membership?.role ?? null
}

async function removeMember(conversationId: string, userId: string): Promise<void> {
  await prisma.conversationMember.delete({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  })
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
  getPublicConversations,
  isMember,
  addMember,
  getMemberRole,
  removeMember,
  isAdmin,
  updateConversation,
  deleteConversation,
}
