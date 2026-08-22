import { authenticationRequired } from '../../../errors/errors'
import { conversationService } from '../../../features/conversations/service'
import { userService } from '../../../features/users/service'
import { GraphQLContext } from '../../context'
import { QueryResolvers } from '../../generated/types'

export const queryResolvers: QueryResolvers<GraphQLContext> = {
  me: async (_parent, _args, context) => {
    if (!context.userId) {
      return null
    }

    return userService.getUserById(context.userId)
  },

  conversations: async (_parent, _args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    return conversationService.getUserConversations(context.userId)
  },

  publicConversations: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    return conversationService.getPublicConversations(args.search ?? undefined)
  },

  conversation: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    const canAccess = await conversationService.canAccessConversation(args.id, context.userId)

    if (!canAccess) {
      return null
    }

    return conversationService.getConversationById(args.id)
  },
}
