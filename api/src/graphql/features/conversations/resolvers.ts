import { authenticationRequired, conversationAccessDenied } from '../../../errors/errors'
import { conversationService } from '../../../features/conversations/service'
import { messageService } from '../../../features/messages/service'
import { GraphQLContext } from '../../context'
import { ConversationResolvers, MutationResolvers } from '../../generated/types'

export const conversationFieldResolvers: Pick<
  ConversationResolvers<GraphQLContext>,
  'messages' | 'isAdmin'
> = {
  isAdmin: async (parent, _args, context) => {
    if (!context.userId) {
      return false
    }

    return conversationService.isAdmin(parent.id, context.userId)
  },

  messages: async (parent, _args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    const canAccess = await conversationService.canAccessConversation(parent.id, context.userId)

    if (!canAccess) {
      throw conversationAccessDenied()
    }

    return messageService.getMessagesByConversationId(parent.id)
  },
}

export const conversationMutationResolvers: Pick<
  MutationResolvers<GraphQLContext>,
  'createConversation' | 'updateConversation' | 'deleteConversation' | 'joinConversation'
> = {
  createConversation: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    return conversationService.createConversation(context.userId, {
      title: args.input.title ?? undefined,
      visibility: args.input.visibility ?? undefined,
    })
  },

  updateConversation: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    return conversationService.updateConversation(args.id, context.userId, {
      title: args.input.title ?? undefined,
      visibility: args.input.visibility ?? undefined,
    })
  },

  deleteConversation: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    await conversationService.deleteConversation(args.id, context.userId)

    return true
  },

  joinConversation: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    return conversationService.joinConversation(args.id, context.userId)
  },
}
