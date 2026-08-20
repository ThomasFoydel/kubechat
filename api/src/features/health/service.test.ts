import { beforeEach, describe, expect, it, vi } from 'vitest'

import { isDatabaseHealthy, isRedisHealthy } from './repository'
import { getReadinessStatus } from './service'

vi.mock('../../config/env', () => ({
  config: {
    nodeEnv: 'test',
    websocketNodeId: 'test-instance',
  },
}))

vi.mock('./repository', () => ({
  isDatabaseHealthy: vi.fn(),
  isRedisHealthy: vi.fn(),
}))

describe('getReadinessStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(isDatabaseHealthy).mockResolvedValue(undefined)
    vi.mocked(isRedisHealthy).mockResolvedValue(undefined)
  })

  it('returns healthy when database and Redis are available', async () => {
    const result = await getReadinessStatus()

    expect(result.status).toBe('ok')
    expect(result.service).toBe('kubechat-api')
    expect(result.environment).toBe('test')
    expect(result.instance).toBe('test-instance')
    expect(result.websocketNode).toBe('test-instance')
    expect(result.database).toBe('connected')
    expect(result.redis).toBe('connected')
    expect(result.timestamp).toEqual(expect.any(String))

    expect(isDatabaseHealthy).toHaveBeenCalledOnce()
    expect(isRedisHealthy).toHaveBeenCalledOnce()
  })

  it('returns an error when the database is unavailable', async () => {
    vi.mocked(isDatabaseHealthy).mockRejectedValue(new Error('Database unavailable'))

    const result = await getReadinessStatus()

    expect(result.status).toBe('error')
    expect(result.database).toBe('unavailable')
    expect(result.redis).toBe('connected')
  })

  it('returns an error when Redis is unavailable', async () => {
    vi.mocked(isRedisHealthy).mockRejectedValue(new Error('Redis unavailable'))

    const result = await getReadinessStatus()

    expect(result.status).toBe('error')
    expect(result.database).toBe('connected')
    expect(result.redis).toBe('unavailable')
  })

  it('returns an error when both dependencies are unavailable', async () => {
    vi.mocked(isDatabaseHealthy).mockRejectedValue(new Error('Database unavailable'))

    vi.mocked(isRedisHealthy).mockRejectedValue(new Error('Redis unavailable'))

    const result = await getReadinessStatus()

    expect(result.status).toBe('error')
    expect(result.database).toBe('unavailable')
    expect(result.redis).toBe('unavailable')
  })
})
