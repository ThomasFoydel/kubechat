import { apiClient } from '@/lib/api-client'

export interface HealthResponse {
  status: string
  service: string
  environment: string
  instance: string
  websocketNode: string
  database: string
  redis: string
  timestamp: string
}

export const healthApi = {
  getReady() {
    return apiClient<HealthResponse>('/api/v1/health/ready')
  },
}
