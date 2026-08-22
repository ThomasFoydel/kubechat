import { apiClient } from '@/lib/api-client'

import type { UserWithPresenceResponse } from '@kubechat/contracts'

export function getUsers(): Promise<UserWithPresenceResponse[]> {
  return apiClient<UserWithPresenceResponse[]>('/api/v1/users')
}
