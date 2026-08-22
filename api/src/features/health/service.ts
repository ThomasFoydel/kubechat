import { config } from '../../config/env'
import { isDatabaseHealthy, isRedisHealthy } from './repository'

export async function getReadinessStatus() {
  let database = 'connected'
  let redis = 'connected'

  try {
    await isDatabaseHealthy()
  } catch (error) {
    console.error(error)
    database = 'unavailable'
  }

  try {
    await isRedisHealthy()
  } catch (error) {
    console.error(error)
    redis = 'unavailable'
  }

  const healthy = database === 'connected' && redis === 'connected'

  return {
    status: healthy ? 'ok' : 'error',
    service: 'kubechat-api',
    environment: config.nodeEnv,
    instance: config.websocketNodeId,
    websocketNode: config.websocketNodeId,
    database,
    redis,
    timestamp: new Date().toISOString(),
  }
}
