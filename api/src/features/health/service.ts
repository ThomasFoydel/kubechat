import {
  isDatabaseHealthy,
  isRedisHealthy
} from "./repository"

export async function getReadinessStatus() {
  let database = 'connected'
  let redis = 'connected'

  try {
    await isDatabaseHealthy()
  } catch(error) {
    console.error(error)
    database = 'unavailable'
  }

  try {
    await isRedisHealthy()
  } catch(err) {
    console.error(err)
    redis = 'unavailable'
  }

  const healthy =
    database === 'connected' &&
    redis === 'connected'

  return {
    status: healthy ? 'ok' : 'error',
    database,
    redis
  }
}