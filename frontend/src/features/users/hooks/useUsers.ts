'use client'

import { useQuery } from '@tanstack/react-query'

import { getUsers } from '../api/users.api'

export function useUsers() {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchInterval: 5000,
  })

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
