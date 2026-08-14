import 'dotenv/config'

import app from './app'
import { config } from './config/env'
import { getGraphQLMiddleware } from './graphql/server'

async function start() {
  const graphqlMiddleware =
    await getGraphQLMiddleware()

  app.use(
    '/graphql',
    graphqlMiddleware
  )

  app.listen(
    config.port,
    () => {
      console.log(
        `KubeChat API listening on port ${config.port}`
      )
    }
  )
}

start().catch((error) => {
  console.error(
    'Failed to start server',
    error
  )

  process.exit(1)
})
