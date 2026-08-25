import { apiClient } from '@/lib/api-client'

import type { UserResponse, UserWithPresenceResponse } from '@kubechat/contracts'

export function getUsers(): Promise<UserWithPresenceResponse[]> {
  return apiClient<UserWithPresenceResponse[]>('/api/v1/users')
}

export function getUserById(id: string): Promise<UserResponse> {
  return apiClient<UserResponse>(`/api/v1/users/${id}`)
}
