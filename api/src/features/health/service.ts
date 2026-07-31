import { isDatabaseHealthy } from "./repository";

export async function getHealthStatus() {
  try {
    await isDatabaseHealthy()

    return {
      status: 'ok',
      databsse: 'connected'
    }
  } catch {
    return {
      status: 'error',
      database: 'unavailable'
    }
  }
}