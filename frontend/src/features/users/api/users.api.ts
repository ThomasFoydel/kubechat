import { apiClient } from '@/lib/api-client'

import type { UserWithPresence } from '../types/user.types'

export function getUsers(): Promise<UserWithPresence[]> {
  return apiClient<UserWithPresence[]>('/api/v1/users')
}
