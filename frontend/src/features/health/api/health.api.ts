import { apiClient } from '@/lib/api-client'

export interface HealthResponse {
  status: string
  service: string
  timestamp: string
}

export const healthApi = {
  getLive() {
    return apiClient<HealthResponse>('/api/v1/health/live')
  },
}
