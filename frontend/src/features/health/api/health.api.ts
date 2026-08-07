import { apiClient } from '@/lib/api-client'
import type {
  LiveHealthResponse,
  ReadyHealthResponse
} from '../types'

export function getLiveHealth() {
  return apiClient<LiveHealthResponse>(
    '/api/v1/health/live'
  )
}

export function getReadyHealth() {
  return apiClient<ReadyHealthResponse>(
    '/api/v1/health/ready'
  )
}