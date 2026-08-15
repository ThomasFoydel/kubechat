'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createConversation, deleteConversation, getConversations } from '../api/chat.api'

import type { ConversationVisibility } from '../types/conversation.types'

const CONVERSATIONS_QUERY_KEY = ['chat', 'conversations']

export function useConversations() {
  const queryClient = useQueryClient()

  const conversationsQuery = useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: getConversations,
  })

  const createMutation = useMutation({
    mutationFn: ({ title, visibility }: { title?: string; visibility?: ConversationVisibility }) =>
      createConversation(title, visibility),

    onSuccess: (conversation) => {
      queryClient.setQueryData(
        CONVERSATIONS_QUERY_KEY,
        (current: Awaited<ReturnType<typeof getConversations>> | undefined) => [
          conversation,
          ...(current ?? []),
        ],
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,

    onSuccess: (_, conversationId) => {
      queryClient.setQueryData(
        CONVERSATIONS_QUERY_KEY,
        (current: Awaited<ReturnType<typeof getConversations>> | undefined) =>
          (current ?? []).filter((conversation) => conversation.id !== conversationId),
      )
    },
  })

  async function handleCreateConversation(title?: string, visibility?: ConversationVisibility) {
    return createMutation.mutateAsync({
      title,
      visibility,
    })
  }

  async function handleDeleteConversation(conversationId: string) {
    return deleteMutation.mutateAsync(conversationId)
  }

  return {
    conversations: conversationsQuery.data ?? [],

    isLoading: conversationsQuery.isLoading,

    error: conversationsQuery.error,

    createConversation: handleCreateConversation,

    isCreating: createMutation.isPending,

    deleteConversation: handleDeleteConversation,

    isDeleting: deleteMutation.isPending,

    deleteError: deleteMutation.error,
  }
}
