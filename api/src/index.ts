import app from './app'
import { config } from './config/env'
import { connectRedis } from './db/redis'

async function start() {
  await connectRedis()

  app.listen(config.port, () => {
    console.log(`KubeChat API listening on port ${config.port}`)
  })
}

start().catch((err) => {
  console.error('Failed to start application:', err)
  process.exit(1)
})