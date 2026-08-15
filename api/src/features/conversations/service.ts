import {
  ConversationResponse,
  CreateConversationInput,
  UpdateConversationInput
} from './dto'
import { conversationRepository } from './repository'

function toConversationResponse(
  conversation: Awaited<
    ReturnType<
      typeof conversationRepository.getConversationById
    >
  >
): ConversationResponse | null {
  if (!conversation) {
    return null
  }

  return {
    id: conversation.id,
    title: conversation.title,
    visibility: conversation.visibility,
    createdAt:
      conversation.createdAt.toISOString(),
    updatedAt:
      conversation.updatedAt.toISOString()
  }
}

async function createConversation(
  userId: string,
  input: CreateConversationInput
): Promise<ConversationResponse> {
  const conversation =
    await conversationRepository.createConversation(
      userId,
      input.title,
      input.visibility ?? 'PRIVATE'
    )

  return {
    id: conversation.id,
    title: conversation.title,
    visibility: conversation.visibility,
    createdAt:
      conversation.createdAt.toISOString(),
    updatedAt:
      conversation.updatedAt.toISOString()
  }
}

async function getConversationById(
  id: string
): Promise<ConversationResponse | null> {
  const conversation =
    await conversationRepository.getConversationById(
      id
    )

  return toConversationResponse(conversation)
}

async function getUserConversations(
  userId: string
): Promise<ConversationResponse[]> {
  const conversations =
    await conversationRepository.getConversationsByUserId(
      userId
    )

  return conversations.map(
    (conversation) => ({
      id: conversation.id,
      title: conversation.title,
      visibility:
        conversation.visibility,
      createdAt:
        conversation.createdAt.toISOString(),
      updatedAt:
        conversation.updatedAt.toISOString()
    })
  )
}

async function updateConversation(
  id: string,
  userId: string,
  input: UpdateConversationInput
): Promise<ConversationResponse> {
  const canUpdate =
    await conversationRepository.isAdmin(
      id,
      userId
    )

  if (!canUpdate) {
    throw new Error(
      'You do not have permission to update this conversation'
    )
  }

  const conversation =
    await conversationRepository.updateConversation(
      id,
      input.title ?? null,
      input.visibility
    )

  return {
    id: conversation.id,
    title: conversation.title,
    visibility: conversation.visibility,
    createdAt:
      conversation.createdAt.toISOString(),
    updatedAt:
      conversation.updatedAt.toISOString()
  }
}

async function deleteConversation(
  id: string,
  userId: string
): Promise<void> {
  const canDelete =
    await conversationRepository.isAdmin(
      id,
      userId
    )

  if (!canDelete) {
    throw new Error(
      'You do not have permission to delete this conversation'
    )
  }

  await conversationRepository.deleteConversation(
    id
  )
}

async function canAccessConversation(
  id: string,
  userId: string
): Promise<boolean> {
  const conversation =
    await conversationRepository.getConversationById(
      id
    )

  if (!conversation) {
    return false
  }

  if (
    conversation.visibility ===
    'PUBLIC'
  ) {
    return true
  }

  return conversationRepository.isMember(
    id,
    userId
  )
}

async function isAdmin(
  id: string,
  userId: string
): Promise<boolean> {
  return conversationRepository.isAdmin(
    id,
    userId
  )
}

export const conversationService = {
  createConversation,
  getConversationById,
  getUserConversations,
  updateConversation,
  deleteConversation,
  canAccessConversation,
  isAdmin
}