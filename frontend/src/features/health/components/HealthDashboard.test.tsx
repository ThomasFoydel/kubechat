import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { healthApi } from '../api/health.api'
import { HealthDashboard } from './HealthDashboard'

vi.mock('../api/health.api', () => ({
  healthApi: {
    getReady: vi.fn(),
  },
}))

describe('HealthDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays system health and Kubernetes information', async () => {
    vi.mocked(healthApi.getReady).mockResolvedValue({
      status: 'ok',
      service: 'kubechat-api',
      environment: 'staging',
      instance: 'kubechat-api-abc123',
      websocketNode: 'kubechat-api-abc123',
      database: 'connected',
      redis: 'connected',
      timestamp: '2026-08-19T12:00:00.000Z',
    })

    render(<HealthDashboard />)

    expect(screen.getByText('Loading system health...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('System Health')).toBeInTheDocument()
    })

    expect(screen.getByText('Healthy')).toBeInTheDocument()
    expect(screen.getAllByText('connected')).toHaveLength(2)
    expect(screen.getAllByText('kubechat-api-abc123')).toHaveLength(3)
    expect(screen.getByText('staging')).toBeInTheDocument()
    expect(screen.getByText('Kubernetes Architecture')).toBeInTheDocument()
    expect(screen.getByText('Redis Pub/Sub')).toBeInTheDocument()
  })

  it('displays an error when health information cannot be loaded', async () => {
    vi.mocked(healthApi.getReady).mockRejectedValue(new Error('Request failed'))

    render(<HealthDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Unable to retrieve system health information.')).toBeInTheDocument()
    })
  })
})
