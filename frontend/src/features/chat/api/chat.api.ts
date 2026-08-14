import { apiClient } from '@/lib/api-client'

import type {
  Conversation,
  Message
} from '../types/conversation.types'

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{
    message: string
  }>
}

async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response =
    await apiClient<GraphQLResponse<T>>(
      '/graphql',
      {
        method: 'POST',
        body: JSON.stringify({
          query,
          variables
        })
      }
    )

  if (
    response.errors &&
    response.errors.length > 0
  ) {
    throw new Error(
      response.errors[0]?.message ??
        'GraphQL request failed'
    )
  }

  if (!response.data) {
    throw new Error(
      'GraphQL response did not contain data'
    )
  }

  return response.data
}

export async function getConversations(): Promise<
  Conversation[]
> {
  const response =
    await graphqlRequest<{
      conversations: Conversation[]
    }>(`
      query GetConversations {
        conversations {
          id
          title
          visibility
          createdAt
          updatedAt
        }
      }
    `)

  return response.conversations
}

export async function createConversation(
  title?: string
): Promise<Conversation> {
  const response =
    await graphqlRequest<{
      createConversation: Conversation
    }>(
      `
        mutation CreateConversation(
          $input: CreateConversationInput!
        ) {
          createConversation(
            input: $input
          ) {
            id
            title
            visibility
            createdAt
            updatedAt
          }
        }
      `,
      {
        input: {
          title
        }
      }
    )

  return response.createConversation
}

export async function getMessages(
  conversationId: string
): Promise<Message[]> {
  const response =
    await graphqlRequest<{
      conversation: {
        messages: Message[]
      } | null
    }>(
      `
        query GetConversation(
          $id: ID!
        ) {
          conversation(id: $id) {
            id
            messages {
              id
              content
              createdAt
              userId
              conversationId
            }
          }
        }
      `,
      {
        id: conversationId
      }
    )

  return response.conversation?.messages ?? []
}
