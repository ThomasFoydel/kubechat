import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { loadFilesSync } from '@graphql-tools/load-files'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { RequestHandler } from 'express'
import path from 'path'

import { createGraphQLContext } from './context'
import { resolvers } from './resolvers'

const typeDefs = loadFilesSync(
  path.join(
    __dirname,
    'features/**/*.graphql'
  )
)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const apolloServer = new ApolloServer({
  schema
})

let started = false

export async function getGraphQLMiddleware(): Promise<RequestHandler> {
  if (!started) {
    await apolloServer.start()
    started = true
  }

  return expressMiddleware(apolloServer, {
    context: async ({ req }) =>
      createGraphQLContext(req)
  })
}