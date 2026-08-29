import { apiClient } from '@/lib/api-client'

import type { FriendshipResponse } from '@kubechat/contracts'

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{
    message: string
  }>
}

async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
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

export async function getFriendships(): Promise<FriendshipResponse[]> {
  const response = await graphqlRequest<{
    friendships: FriendshipResponse[]
  }>(`
    query GetFriendships {
      friendships {
        id
        requesterId
        recipientId
        status
        createdAt
        updatedAt
      }
    }
  `)

  return response.friendships
}

export async function sendFriendRequest(userId: string): Promise<FriendshipResponse> {
  const response = await graphqlRequest<{
    sendFriendRequest: FriendshipResponse
  }>(
    `
      mutation SendFriendRequest($userId: ID!) {
        sendFriendRequest(userId: $userId) {
          id
          requesterId
          recipientId
          status
          createdAt
          updatedAt
        }
      }
    `,
    { userId },
  )

  return response.sendFriendRequest
}

export async function acceptFriendRequest(id: string): Promise<FriendshipResponse> {
  const response = await graphqlRequest<{
    acceptFriendRequest: FriendshipResponse
  }>(
    `
      mutation AcceptFriendRequest($id: ID!) {
        acceptFriendRequest(id: $id) {
          id
          requesterId
          recipientId
          status
          createdAt
          updatedAt
        }
      }
    `,
    { id },
  )

  return response.acceptFriendRequest
}

export async function rejectFriendRequest(id: string): Promise<FriendshipResponse> {
  const response = await graphqlRequest<{
    rejectFriendRequest: FriendshipResponse
  }>(
    `
      mutation RejectFriendRequest($id: ID!) {
        rejectFriendRequest(id: $id) {
          id
          requesterId
          recipientId
          status
          createdAt
          updatedAt
        }
      }
    `,
    { id },
  )

  return response.rejectFriendRequest
}

export async function cancelFriendRequest(id: string): Promise<boolean> {
  const response = await graphqlRequest<{
    cancelFriendRequest: boolean
  }>(
    `
      mutation CancelFriendRequest($id: ID!) {
        cancelFriendRequest(id: $id)
      }
    `,
    { id },
  )

  return response.cancelFriendRequest
}

export async function removeFriend(id: string): Promise<boolean> {
  const response = await graphqlRequest<{
    removeFriend: boolean
  }>(
    `
      mutation RemoveFriend($id: ID!) {
        removeFriend(id: $id)
      }
    `,
    { id },
  )

  return response.removeFriend
}
