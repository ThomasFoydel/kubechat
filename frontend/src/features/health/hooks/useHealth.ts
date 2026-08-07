import { useQuery } from '@tanstack/react-query'
import {
  getLiveHealth,
  getReadyHealth
} from '../api/health.api'

export function useHealth() {
  const live = useQuery({
    queryKey: ['health', 'live'],
    queryFn: getLiveHealth,
    refetchInterval: 30000
  })

  const ready = useQuery({
    queryKey: ['health', 'ready'],
    queryFn: getReadyHealth,
    refetchInterval: 30000
  })

  return {
    live,
    ready
  }
}