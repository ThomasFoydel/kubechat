'use client'

import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'

import {
  getCurrentUser,
  login as loginUser,
  logout as logoutUser,
  register as registerUser
} from '../api/auth.api'

import type {
  LoginRequest,
  RegisterRequest,
  User
} from '../types/auth.types'

const CURRENT_USER_QUERY_KEY = ['auth', 'current-user']

export function useAuth() {
  const queryClient = useQueryClient()

  const currentUserQuery = useQuery<User | null>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) =>
      loginUser(data),
    onSuccess: user => {
      queryClient.setQueryData(
        CURRENT_USER_QUERY_KEY,
        user
      )
    }
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) =>
      registerUser(data),
    onSuccess: user => {
      queryClient.setQueryData(
        CURRENT_USER_QUERY_KEY,
        user
      )
    }
  })

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(
        CURRENT_USER_QUERY_KEY,
        null
      )
    }
  })

  return {
    user: currentUserQuery.data ?? null,

    isLoading: currentUserQuery.isLoading,

    isAuthenticated: !!currentUserQuery.data,

    login: loginMutation.mutateAsync,

    register: registerMutation.mutateAsync,

    logout: logoutMutation.mutateAsync,

    isLoggingIn: loginMutation.isPending,

    isRegistering: registerMutation.isPending,

    isLoggingOut: logoutMutation.isPending,

    loginError: loginMutation.error,

    registerError: registerMutation.error,

    logoutError: logoutMutation.error
  }
}