import {
  ConversationResponse,
  CreateConversationInput,
  UpdateConversationInput,
} from '@kubechat/contracts'
import { conversationNotFound, conversationNotPublic, forbidden } from '../../errors/errors'
import { conversationRepository } from './repository'

function toConversationResponse(
  conversation: Awaited<ReturnType<typeof conversationRepository.getConversationById>>,
): ConversationResponse | null {
  if (!conversation) {
    return null
  }

  return {
    id: conversation.id,
    title: conversation.title,
    visibility: conversation.visibility,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  }
}

function mapConversationResponse(
  conversation: Awaited<ReturnType<typeof conversationRepository.getConversationById>> & object,
): ConversationResponse {
  return {
    id: conversation.id,
    title: conversation.title,
    visibility: conversation.visibility,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  }
}

async function createConversation(
  userId: string,
  input: CreateConversationInput,
): Promise<ConversationResponse> {
  const conversation = await conversationRepository.createConversation(
    userId,
    input.title,
    input.visibility ?? 'PRIVATE',
  )

  return mapConversationResponse(conversation)
}

async function getConversationById(id: string): Promise<ConversationResponse | null> {
  const conversation = await conversationRepository.getConversationById(id)

  return toConversationResponse(conversation)
}

async function getUserConversations(userId: string): Promise<ConversationResponse[]> {
  const conversations = await conversationRepository.getConversationsByUserId(userId)

  return conversations.map(mapConversationResponse)
}

async function getPublicConversations(search?: string): Promise<ConversationResponse[]> {
  const conversations = await conversationRepository.getPublicConversations(
    search?.trim() || undefined,
  )

  return conversations.map(mapConversationResponse)
}

async function updateConversation(
  id: string,
  userId: string,
  input: UpdateConversationInput,
): Promise<ConversationResponse> {
  const canUpdate = await conversationRepository.isAdmin(id, userId)

  if (!canUpdate) {
    throw forbidden('You do not have permission to update this conversation')
  }

  const conversation = await conversationRepository.updateConversation(
    id,
    input.title ?? null,
    input.visibility,
  )

  return mapConversationResponse(conversation)
}

async function deleteConversation(id: string, userId: string): Promise<void> {
  const canDelete = await conversationRepository.isAdmin(id, userId)

  if (!canDelete) {
    throw forbidden('You do not have permission to delete this conversation')
  }

  await conversationRepository.deleteConversation(id)
}

async function joinConversation(id: string, userId: string): Promise<ConversationResponse> {
  const conversation = await conversationRepository.getConversationById(id)

  if (!conversation) {
    throw conversationNotFound()
  }

  if (conversation.visibility !== 'PUBLIC') {
    throw conversationNotPublic()
  }

  await conversationRepository.addMember(id, userId)

  return mapConversationResponse(conversation)
}

async function canAccessConversation(id: string, userId: string): Promise<boolean> {
  const conversation = await conversationRepository.getConversationById(id)

  if (!conversation) {
    return false
  }

  if (conversation.visibility === 'PUBLIC') {
    return true
  }

  return conversationRepository.isMember(id, userId)
}

async function isAdmin(id: string, userId: string): Promise<boolean> {
  return conversationRepository.isAdmin(id, userId)
}

export const conversationService = {
  createConversation,
  getConversationById,
  getUserConversations,
  getPublicConversations,
  updateConversation,
  deleteConversation,
  joinConversation,
  canAccessConversation,
  isAdmin,
}
