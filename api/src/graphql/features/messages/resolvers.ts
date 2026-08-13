import { messageService } from '../../../features/messages/service'
import { GraphQLContext } from '../../context'
import { MutationResolvers } from '../../generated/types'

export const messageMutationResolvers: Pick<
  MutationResolvers<GraphQLContext>,
  'createMessage'
> = {
  createMessage: async (
    _parent,
    args,
    context
  ) => {
    if (!context.userId) {
      throw new Error('Authentication required')
    }

    return messageService.createMessage(
      args.conversationId,
      context.userId,
      {
        content: args.input.content
      }
    )
  }
}