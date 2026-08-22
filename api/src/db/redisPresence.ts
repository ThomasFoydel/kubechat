import { createClient } from 'redis'

import { config } from '../config/env'

const userConnectionsPrefix = 'kubechat:presence:user:'

const connectionLeaseSeconds = 30

const presenceClient = createClient({
  url: config.redisUrl,
})

presenceClient.on('error', (error) => {
  console.error('Redis presence error:', error)
})

presenceClient.on('reconnecting', () => {
  console.warn('Redis presence reconnecting')
})

function getUserConnectionsKey(userId: string): string {
  return `${userConnectionsPrefix}${userId}:connections`
}

function getUserConnectionMetadataKey(userId: string): string {
  return `${userConnectionsPrefix}${userId}:nodes`
}

function getLeaseExpiration(): number {
  return Date.now() + connectionLeaseSeconds * 1000
}

async function ensureConnected(): Promise<void> {
  if (!presenceClient.isOpen) {
    await presenceClient.connect()
  }
}

export async function registerUserPresence(userId: string, connectionId: string): Promise<void> {
  await ensureConnected()

  const connectionsKey = getUserConnectionsKey(userId)
  const metadataKey = getUserConnectionMetadataKey(userId)

  await presenceClient.zAdd(connectionsKey, {
    score: getLeaseExpiration(),
    value: connectionId,
  })

  await presenceClient.hSet(metadataKey, connectionId, config.websocketNodeId)
}

export async function refreshUserPresence(userId: string, connectionId: string): Promise<void> {
  await ensureConnected()

  await presenceClient.zAdd(getUserConnectionsKey(userId), {
    score: getLeaseExpiration(),
    value: connectionId,
  })
}

export async function unregisterUserPresence(userId: string, connectionId: string): Promise<void> {
  await ensureConnected()

  const connectionsKey = getUserConnectionsKey(userId)
  const metadataKey = getUserConnectionMetadataKey(userId)

  await presenceClient.zRem(connectionsKey, connectionId)
  await presenceClient.hDel(metadataKey, connectionId)
}

export async function getUserPresence(userId: string): Promise<{
  online: boolean
  nodes: string[]
}> {
  await ensureConnected()

  const connectionsKey = getUserConnectionsKey(userId)
  const metadataKey = getUserConnectionMetadataKey(userId)
  const now = Date.now()

  const expiredConnections = await presenceClient.zRangeByScore(connectionsKey, 0, now)

  if (expiredConnections.length > 0) {
    await presenceClient.zRemRangeByScore(connectionsKey, 0, now)
    await presenceClient.hDel(metadataKey, expiredConnections)
  }

  const activeConnections = await presenceClient.zRangeByScore(connectionsKey, now, '+inf')

  if (activeConnections.length === 0) {
    return {
      online: false,
      nodes: [],
    }
  }

  const nodeValues = await presenceClient.hmGet(metadataKey, activeConnections)

  const nodes = Array.from(new Set(nodeValues.filter((node): node is string => Boolean(node))))

  return {
    online: true,
    nodes,
  }
}

export async function disconnectRedisPresence(): Promise<void> {
  if (presenceClient.isOpen) {
    await presenceClient.quit()
  }
}
