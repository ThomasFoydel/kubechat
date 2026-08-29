'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useChatContext } from '@/features/chat/context/ChatProvider'

import { getUsers } from '../api/users.api'

export function useUsers() {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  const { presenceByUserId, setUserPresence } = useChatContext()

  useEffect(() => {
    if (!query.data) {
      return
    }

    for (const user of query.data) {
      setUserPresence(user.id, user.presence)
    }
  }, [query.data, setUserPresence])

  const users = (query.data ?? []).map((user) => ({
    ...user,
    presence: presenceByUserId[user.id] ?? user.presence,
  }))

  return {
    users,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
