import {
  conversationFieldResolvers,
  conversationMutationResolvers,
} from '../features/conversations/resolvers'
import { queryResolvers } from '../features/query/resolvers'
import {
  friendshipMutationResolvers,
  friendshipQueryResolvers,
} from '../features/friendships/resolvers'
import { userResolvers } from '../features/users/resolvers'

export const resolvers = {
  Query: {
    ...queryResolvers,
    ...friendshipQueryResolvers,
  },

  Conversation: {
    ...conversationFieldResolvers,
  },

  Mutation: {
    ...conversationMutationResolvers,
    ...friendshipMutationResolvers,
  },

  ...userResolvers,
}
