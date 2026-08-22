import { beforeEach, describe, expect, it, vi } from 'vitest'

const { redisMock } = vi.hoisted(() => ({
  redisMock: {
    isOpen: true,
    connect: vi.fn(),
    zAdd: vi.fn(),
    hSet: vi.fn(),
    zRem: vi.fn(),
    hDel: vi.fn(),
    zRangeByScore: vi.fn(),
    zRemRangeByScore: vi.fn(),
    zRangeByScore: vi.fn(),
    hmGet: vi.fn(),
    quit: vi.fn(),
    on: vi.fn(),
  },
}))

vi.mock('redis', () => ({
  createClient: vi.fn(() => redisMock),
}))

vi.mock('../config/env', () => ({
  config: {
    redisUrl: 'redis://localhost:6379',
    websocketNodeId: 'test-node',
  },
}))

import { getUserPresence } from './redisPresence'

describe('getUserPresence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('removes expired connections and reports the user offline', async () => {
    redisMock.zRangeByScore.mockResolvedValueOnce(['expired-connection']).mockResolvedValueOnce([])

    const result = await getUserPresence('user-1')

    expect(redisMock.zRemRangeByScore).toHaveBeenCalledWith(
      'kubechat:presence:user:user-1:connections',
      0,
      expect.any(Number),
    )

    expect(redisMock.hDel).toHaveBeenCalledWith('kubechat:presence:user:user-1:nodes', [
      'expired-connection',
    ])

    expect(result).toEqual({
      online: false,
      nodes: [],
    })
  })
})
