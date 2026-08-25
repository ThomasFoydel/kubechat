import { authenticationRequired } from '../../../errors/errors'
import { friendshipService } from '../../../features/friendships/service'
import { GraphQLContext } from '../../context'
import {
  FriendshipStatus,
  MutationResolvers,
  QueryResolvers,
} from '../../generated/types'

function mapFriendshipStatus(status: 'PENDING' | 'ACCEPTED' | 'REJECTED'): FriendshipStatus {
  switch (status) {
    case 'PENDING':
      return FriendshipStatus.Pending
    case 'ACCEPTED':
      return FriendshipStatus.Accepted
    case 'REJECTED':
      return FriendshipStatus.Rejected
  }
}

function mapFriendshipResponse<T extends {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
}>(friendship: T): T & { status: FriendshipStatus } {
  return {
    ...friendship,
    status: mapFriendshipStatus(friendship.status),
  }
}

export const friendshipQueryResolvers: QueryResolvers<GraphQLContext> = {
  friendships: async (_parent, _args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    const friendships = await friendshipService.getUserFriendships(context.userId)

    return friendships.map(mapFriendshipResponse)
  },
}

export const friendshipMutationResolvers: MutationResolvers<GraphQLContext> = {
  sendFriendRequest: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    const friendship = await friendshipService.sendFriendRequest(context.userId, args.userId)

    return mapFriendshipResponse(friendship)
  },

  acceptFriendRequest: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    const friendship = await friendshipService.acceptFriendRequest(args.id, context.userId)

    return mapFriendshipResponse(friendship)
  },

  rejectFriendRequest: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    const friendship = await friendshipService.rejectFriendRequest(args.id, context.userId)

    return mapFriendshipResponse(friendship)
  },

  cancelFriendRequest: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    const friendship = await friendshipService.cancelFriendRequest(args.id, context.userId)

    return friendship
  },

  removeFriend: async (_parent, args, context) => {
    if (!context.userId) {
      throw authenticationRequired()
    }

    const friendship = await friendshipService.removeFriend(args.id, context.userId)

    return friendship
  },
}
