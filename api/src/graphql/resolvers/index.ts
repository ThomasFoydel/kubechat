import {
  conversationFieldResolvers,
  conversationMutationResolvers
} from '../features/conversations/resolvers'
import { queryResolvers } from '../features/query/resolvers'
import { userResolvers } from '../features/users/resolvers'

export const resolvers = {
  Query: {
    ...queryResolvers
  },

  Conversation: {
    ...conversationFieldResolvers
  },

  Mutation: {
    ...conversationMutationResolvers
  },

  ...userResolvers
}