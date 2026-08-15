import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getReadinessStatus } from './service'
import { isDatabaseHealthy, isRedisHealthy } from './repository'

vi.mock('./repository', () => ({
  isDatabaseHealthy: vi.fn(),
  isRedisHealthy: vi.fn(),
}))

describe('getReadinessStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns ok when the database and Redis are healthy', async () => {
    vi.mocked(isDatabaseHealthy).mockResolvedValue(undefined)
    vi.mocked(isRedisHealthy).mockResolvedValue(undefined)

    const result = await getReadinessStatus()

    expect(result.status).toBe('ok')
    expect(result.service).toBe('kubechat-api')
    expect(result.database).toBe('connected')
    expect(result.redis).toBe('connected')

    expect(isDatabaseHealthy).toHaveBeenCalledOnce()
    expect(isRedisHealthy).toHaveBeenCalledOnce()
  })

  it('reports the database as unavailable when the database check fails', async () => {
    vi.mocked(isDatabaseHealthy).mockRejectedValue(new Error('Database unavailable'))
    vi.mocked(isRedisHealthy).mockResolvedValue(undefined)

    const result = await getReadinessStatus()

    expect(result.status).toBe('error')
    expect(result.database).toBe('unavailable')
    expect(result.redis).toBe('connected')
  })

  it('reports Redis as unavailable when the Redis check fails', async () => {
    vi.mocked(isDatabaseHealthy).mockResolvedValue(undefined)
    vi.mocked(isRedisHealthy).mockRejectedValue(new Error('Redis unavailable'))

    const result = await getReadinessStatus()

    expect(result.status).toBe('error')
    expect(result.database).toBe('connected')
    expect(result.redis).toBe('unavailable')
  })

  it('reports both dependencies as unavailable when both checks fail', async () => {
    vi.mocked(isDatabaseHealthy).mockRejectedValue(new Error('Database unavailable'))
    vi.mocked(isRedisHealthy).mockRejectedValue(new Error('Redis unavailable'))

    const result = await getReadinessStatus()

    expect(result.status).toBe('error')
    expect(result.database).toBe('unavailable')
    expect(result.redis).toBe('unavailable')
  })
})
