import { Message } from '../../../generated/prisma'
import { prisma } from '../../db/prisma'

async function createMessage(
  conversationId: string,
  userId: string,
  content: string,
): Promise<Message> {
  return prisma.message.create({
    data: {
      conversationId,
      userId,
      content,
    },
  })
}

async function getMessagesByConversationId(conversationId: string): Promise<Message[]> {
  return prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

async function getMessageById(id: string): Promise<Message | null> {
  return prisma.message.findUnique({
    where: {
      id,
    },
  })
}

export const messageRepository = {
  createMessage,
  getMessagesByConversationId,
  getMessageById,
}
