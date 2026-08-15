'use client'

import { useEffect, useState } from 'react'
import { healthApi, HealthResponse } from '../api/health.api'

export function useHealth() {
  const [data, setData] = useState<HealthResponse>()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    healthApi
      .getLive()
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
