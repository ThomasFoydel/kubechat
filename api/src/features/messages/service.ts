import { CreateMessageInput, MessageResponse } from './dto'
import { messageRepository } from './repository'

function toMessageResponse(
  message: Awaited<ReturnType<typeof messageRepository.getMessageById>>,
): MessageResponse | null {
  if (!message) {
    return null
  }

  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    userId: message.userId,
    conversationId: message.conversationId,
  }
}

async function createMessage(
  conversationId: string,
  userId: string,
  input: CreateMessageInput,
): Promise<MessageResponse> {
  const message = await messageRepository.createMessage(conversationId, userId, input.content)

  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    userId: message.userId,
    conversationId: message.conversationId,
  }
}

async function getMessagesByConversationId(conversationId: string): Promise<MessageResponse[]> {
  const messages = await messageRepository.getMessagesByConversationId(conversationId)

  return messages.map((message) => ({
    id: message.id,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    userId: message.userId,
    conversationId: message.conversationId,
  }))
}

async function getMessageById(id: string): Promise<MessageResponse | null> {
  const message = await messageRepository.getMessageById(id)

  return toMessageResponse(message)
}

export const messageService = {
  createMessage,
  getMessagesByConversationId,
  getMessageById,
}
