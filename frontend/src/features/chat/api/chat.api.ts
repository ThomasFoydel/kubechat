import { apiClient } from '@/lib/api-client'

import type { Conversation, Message, ConversationVisibility } from '@kubechat/contracts'

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{
    message: string
  }>
}

async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await apiClient<GraphQLResponse<T>>('/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0]?.message ?? 'GraphQL request failed')
  }

  if (!response.data) {
    throw new Error('GraphQL response did not contain data')
  }

  return response.data
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await graphqlRequest<{
    conversations: Conversation[]
  }>(`
    query GetConversations {
      conversations {
        id
        title
        visibility
        isAdmin
        createdAt
        updatedAt
      }
    }
  `)

  return response.conversations
}

export async function getPublicConversations(search?: string): Promise<Conversation[]> {
  const response = await graphqlRequest<{
    publicConversations: Conversation[]
  }>(
    `
      query GetPublicConversations($search: String) {
        publicConversations(search: $search) {
          id
          title
          visibility
          isAdmin
          createdAt
          updatedAt
        }
      }
    `,
    {
      search: search?.trim() || undefined,
    },
  )

  return response.publicConversations
}

export async function createConversation(
  title?: string,
  visibility?: ConversationVisibility,
): Promise<Conversation> {
  const response = await graphqlRequest<{
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
          isAdmin
          createdAt
          updatedAt
        }
      }
    `,
    {
      input: {
        title,
        visibility,
      },
    },
  )

  return response.createConversation
}

export async function joinConversation(conversationId: string): Promise<Conversation> {
  const response = await graphqlRequest<{
    joinConversation: Conversation
  }>(
    `
      mutation JoinConversation($id: ID!) {
        joinConversation(id: $id) {
          id
          title
          visibility
          isAdmin
          createdAt
          updatedAt
        }
      }
    `,
    {
      id: conversationId,
    },
  )

  return response.joinConversation
}

export async function deleteConversation(conversationId: string): Promise<boolean> {
  const response = await graphqlRequest<{
    deleteConversation: boolean
  }>(
    `
      mutation DeleteConversation(
        $id: ID!
      ) {
        deleteConversation(id: $id)
      }
    `,
    {
      id: conversationId,
    },
  )

  return response.deleteConversation
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const response = await graphqlRequest<{
    conversation: {
      id: string
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
            username
            conversationId
          }
        }
      }
    `,
    {
      id: conversationId,
    },
  )

  return response.conversation?.messages ?? []
}
