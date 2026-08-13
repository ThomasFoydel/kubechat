import { conversationService } from '../../../features/conversations/service'
import { userService } from '../../../features/users/service'
import { GraphQLContext } from '../../context'
import { QueryResolvers } from '../../generated/types'

export const queryResolvers: QueryResolvers<GraphQLContext> = {
  me: async (
    _parent,
    _args,
    context
  ) => {
    if (!context.userId) {
      return null
    }

    return userService.getUserById(context.userId)
  },

  conversations: async (
    _parent,
    _args,
    context
  ) => {
    if (!context.userId) {
      throw new Error('Authentication required')
    }

    return conversationService.getUserConversations(
      context.userId
    )
  },

  conversation: async (
    _parent,
    args,
    context
  ) => {
    if (!context.userId) {
      throw new Error('Authentication required')
    }

    const canAccess =
      await conversationService.canAccessConversation(
        args.id,
        context.userId
      )

    if (!canAccess) {
      return null
    }

    return conversationService.getConversationById(
      args.id
    )
  }
}
