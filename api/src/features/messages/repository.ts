import { Message } from '../../../generated/prisma'
import { prisma } from '../../db/prisma'

const MESSAGE_LOAD_LIMIT = 100

const messageWithUserSelect = {
  id: true,
  content: true,
  createdAt: true,
  userId: true,
  conversationId: true,
  user: {
    select: {
      username: true,
    },
  },
} as const

type MessageWithUser = Message & {
  user: {
    username: string
  }
}

async function createMessage(
  conversationId: string,
  userId: string,
  content: string,
): Promise<MessageWithUser> {
  return prisma.message.create({
    data: {
      conversationId,
      userId,
      content,
    },
    select: messageWithUserSelect,
  })
}

async function getMessagesByConversationId(conversationId: string): Promise<MessageWithUser[]> {
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: MESSAGE_LOAD_LIMIT,
    select: messageWithUserSelect,
  })

  return messages.reverse()
}

async function getMessageById(id: string): Promise<MessageWithUser | null> {
  return prisma.message.findUnique({
    where: {
      id,
    },
    select: messageWithUserSelect,
  })
}

export const messageRepository = {
  createMessage,
  getMessagesByConversationId,
  getMessageById,
}
