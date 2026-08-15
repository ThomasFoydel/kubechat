import 'dotenv/config'

import { createServer } from 'http'

import app from './app'
import { config } from './config/env'
import { connectRedis, disconnectRedis } from './db/redis'
import { disconnectRedisPubSub } from './db/redisPubSub'
import { getGraphQLMiddleware } from './graphql/server'
import {
  closeWebSocketConnections,
  createWebSocketServer,
  initializeWebSocketPubSub,
  websocketPath,
} from './websocket/server'

async function start() {
  await connectRedis()

  const graphqlMiddleware = await getGraphQLMiddleware()

  app.use('/graphql', graphqlMiddleware)

  const server = createServer(app)

  const wss = createWebSocketServer()

  await initializeWebSocketPubSub()

  server.on('upgrade', (request, socket, head) => {
    if (request.url !== websocketPath) {
      socket.destroy()
      return
    }

    wss.handleUpgrade(request, socket, head, (websocket) => {
      wss.emit('connection', websocket, request)
    })
  })

  server.listen(config.port, () => {
    console.log(`KubeChat API listening on port ${config.port}`)
  })

  let shuttingDown = false

  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) {
      return
    }

    shuttingDown = true

    console.log(`Received ${signal}, shutting down`)

    closeWebSocketConnections(wss)

    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve()
      })
    })

    await disconnectRedisPubSub()
    await disconnectRedis()

    console.log('KubeChat API shutdown complete')
  }

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM')
  })

  process.once('SIGINT', () => {
    void shutdown('SIGINT')
  })
}

start().catch((error) => {
  console.error('Failed to start server', error)

  process.exit(1)
})
