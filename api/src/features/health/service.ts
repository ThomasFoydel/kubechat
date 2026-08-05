import { isDatabaseHealthy } from "./repository"

export async function getHealthStatus() {
  try {
    await isDatabaseHealthy()

    return {
      status: 'ok',
      database: 'connected'
    }
  } catch(error) {
    console.error(error)
    return {
      status: 'error',
      database: 'unavailable'
    }
  }
}