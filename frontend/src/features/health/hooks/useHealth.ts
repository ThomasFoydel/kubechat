'use client'

import { useEffect, useState } from 'react'

import type { HealthStatus } from '@kubechat/contracts'

import { healthApi } from '../api/health.api'

export function useHealth() {
  const [data, setData] = useState<HealthStatus>()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    healthApi
      .getReady()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return {
    data,
    error,
    isLoading,
  }
}
