'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  acceptFriendRequest,
  cancelFriendRequest,
  getFriendships,
  rejectFriendRequest,
  sendFriendRequest,
} from '../api/friendships.api'

export const FRIENDSHIPS_QUERY_KEY = ['friendships']

export function useFriendships() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: FRIENDSHIPS_QUERY_KEY,
    queryFn: getFriendships,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: FRIENDSHIPS_QUERY_KEY,
    })
  }

  const sendMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: invalidate,
  })

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: invalidate,
  })

  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: invalidate,
  })

  const cancelMutation = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: invalidate,
  })

  return {
    friendships: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    sendFriendRequest: sendMutation.mutateAsync,
    acceptFriendRequest: acceptMutation.mutateAsync,
    rejectFriendRequest: rejectMutation.mutateAsync,
    cancelFriendRequest: cancelMutation.mutateAsync,
    isMutating:
      sendMutation.isPending ||
      acceptMutation.isPending ||
      rejectMutation.isPending ||
      cancelMutation.isPending,
  }
}
