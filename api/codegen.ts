import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'src/graphql/features/**/*.graphql',
  generates: {
    'src/graphql/generated/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../context#GraphQLContext',
        useIndexSignature: true,
        maybeValue: 'T | null | undefined',
        inputMaybeValue: 'T | null | undefined',

        mappers: {
          Conversation: '../../features/conversations/dto#ConversationResponse',
        },
      },
    },
  },
}

export default config
