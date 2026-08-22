import { RequestHandler } from 'express'
import { GraphQLError } from 'graphql'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { loadFilesSync } from '@graphql-tools/load-files'
import { makeExecutableSchema } from '@graphql-tools/schema'
import path from 'path'

import { isAppError } from '../errors/app-error'
import { createGraphQLContext } from './context'
import { resolvers } from './resolvers'

const typeDefs = loadFilesSync(path.join(__dirname, 'features/**/*.graphql'))

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const apolloServer = new ApolloServer({
  schema,

  formatError: (formattedError, error) => {
    const originalError = error instanceof GraphQLError ? error.originalError : undefined

    if (isAppError(originalError)) {
      return new GraphQLError(originalError.message, {
        extensions: {
          code: originalError.code,
          ...(originalError.details !== undefined ? { details: originalError.details } : {}),
        },
      })
    }

    console.error('Unhandled GraphQL error:', error)

    return new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    })
  },
})

let started = false

export async function getGraphQLMiddleware(): Promise<RequestHandler> {
  if (!started) {
    await apolloServer.start()
    started = true
  }

  return expressMiddleware(apolloServer, {
    context: async ({ req }) => createGraphQLContext(req),
  })
}
