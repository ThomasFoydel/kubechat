import { Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { livenessCheck, readinessCheck } from './controller'
import { getReadinessStatus } from './service'

vi.mock('./service', () => ({
  getReadinessStatus: vi.fn(),
}))

describe('livenessCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a healthy status', async () => {
    const req = {} as Request

    const res = {
      json: vi.fn(),
    } as unknown as Response

    await livenessCheck(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        service: 'kubechat-api',
      }),
    )
  })

  it('includes an ISO timestamp', async () => {
    const req = {} as Request

    const res = {
      json: vi.fn(),
    } as unknown as Response

    await livenessCheck(req, res)

    const response = vi.mocked(res.json).mock.calls[0][0]

    expect(response.timestamp).toEqual(expect.any(String))

    expect(Number.isNaN(Date.parse(response.timestamp))).toBe(false)
  })
})

describe('readinessCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the health status when dependencies are healthy', async () => {
    const health = {
      status: 'ok',
      service: 'kubechat-api',
      database: 'connected',
      redis: 'connected',
      timestamp: new Date().toISOString(),
    }

    vi.mocked(getReadinessStatus).mockResolvedValue(health)

    const req = {} as Request

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response

    await readinessCheck(req, res)

    expect(getReadinessStatus).toHaveBeenCalledOnce()
    expect(res.json).toHaveBeenCalledWith(health)
    expect(res.status).not.toHaveBeenCalled()
  })

  it('returns 503 when a dependency is unavailable', async () => {
    const health = {
      status: 'error',
      service: 'kubechat-api',
      database: 'unavailable',
      redis: 'connected',
      timestamp: new Date().toISOString(),
    }

    vi.mocked(getReadinessStatus).mockResolvedValue(health)

    const req = {} as Request

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response

    await readinessCheck(req, res)

    expect(getReadinessStatus).toHaveBeenCalledOnce()
    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).toHaveBeenCalledWith(health)
  })
})
