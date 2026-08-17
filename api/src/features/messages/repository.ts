import { Message } from '../../../generated/prisma'
import { prisma } from '../../db/prisma'

const MESSAGE_LOAD_LIMIT = 100

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
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: MESSAGE_LOAD_LIMIT,
  })

  return messages.reverse()
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
