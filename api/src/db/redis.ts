import { createClient } from 'redis'
import { config } from '../config/env'

export const redis = createClient({
  url: config.redisUrl,
  socket: {
    reconnectStrategy: retries => {
      const delay = Math.min(
        1000 * 2 ** retries,
        30000
      )

      console.warn(
        `Redis reconnecting in ${delay}ms`
      )

      return delay
    }
  }
})

redis.on('error', error => {
  console.error(
    'Redis error:',
    error
  )
})

redis.on('connect', () => {
  console.log('Redis connected')
})

redis.on('ready', () => {
  console.log('Redis ready')
})

redis.on('reconnecting', () => {
  console.warn('Redis reconnecting')
})

redis.on('end', () => {
  console.warn('Redis connection closed')
})

export async function connectRedis(): Promise<void> {
  if (!redis.isOpen) {
    await redis.connect()
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis.isOpen) {
    await redis.quit()
  }
}