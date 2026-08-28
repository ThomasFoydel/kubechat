import { apiClient } from '@/lib/api-client'

import type {
  UserPresence,
  UserResponse,
  UserWithPresenceResponse,
} from '@kubechat/contracts'

export function getUsers(): Promise<UserWithPresenceResponse[]> {
  return apiClient<UserWithPresenceResponse[]>('/api/v1/users')
}

export function getUserById(id: string): Promise<UserResponse> {
  return apiClient<UserResponse>(`/api/v1/users/${id}`)
}

export function getUserPresence(id: string): Promise<UserPresence> {
  return apiClient<UserPresence>(`/api/v1/users/${id}/presence`)
}
