import { apiClient } from '@/lib/api-client'

import type { HealthStatus } from '@kubechat/contracts'

export const healthApi = {
  getReady() {
    return apiClient<HealthStatus>('/api/v1/health/ready')
  },
}
