'use client'

import { HealthCard } from './HealthCard'
import { useHealth } from '../hooks/useHealth'

export function HealthDashboard() {
  const { data, isLoading, error } = useHealth()

  if (isLoading) {
    return <div>Loading health...</div>
  }

  if (error) {
    return <div>Error loading health</div>
  }

  if (!data) {
    return <div>No health data</div>
  }

  return (
    <div className="grid gap-4">
      <HealthCard status={data.status} service={data.service} />
    </div>
  )
}
