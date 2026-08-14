'use client'

import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'

import {
  createConversation,
  getConversations
} from '../api/chat.api'

const CONVERSATIONS_QUERY_KEY = [
  'chat',
  'conversations'
]

export function useConversations() {
  const queryClient =
    useQueryClient()

  const conversationsQuery =
    useQuery({
      queryKey:
        CONVERSATIONS_QUERY_KEY,
      queryFn: getConversations
    })

  const createMutation =
    useMutation({
      mutationFn: (title?: string) =>
        createConversation(title),

      onSuccess: conversation => {
        queryClient.setQueryData(
          CONVERSATIONS_QUERY_KEY,
          (
            current:
              | Awaited<
                ReturnType<
                  typeof getConversations
                >
              >
              | undefined
          ) => [
              conversation,
              ...(current ?? [])
            ]
        )
      }
    })

  async function handleCreateConversation(
    title?: string
  ) {
    return createMutation.mutateAsync(
      title
    )
  }

  return {
    conversations:
      conversationsQuery.data ?? [],

    isLoading:
      conversationsQuery.isLoading,

    error:
      conversationsQuery.error,

    createConversation:
      handleCreateConversation,

    isCreating:
      createMutation.isPending
  }
}
