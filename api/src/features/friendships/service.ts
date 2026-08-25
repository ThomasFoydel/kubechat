import type { FriendshipResponse } from '@kubechat/contracts'
import { userNotFound, forbidden } from '../../errors/errors'
import { userService } from '../users/service'
import { friendshipRepository } from './repository'

function mapFriendshipResponse(friendship: {
  id: string
  requesterId: string
  recipientId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: Date
  updatedAt: Date
}): FriendshipResponse {
  return {
    id: friendship.id,
    requesterId: friendship.requesterId,
    recipientId: friendship.recipientId,
    status: friendship.status,
    createdAt: friendship.createdAt.toISOString(),
    updatedAt: friendship.updatedAt.toISOString(),
  }
}

async function sendFriendRequest(
  requesterId: string,
  recipientId: string,
): Promise<FriendshipResponse> {
  if (requesterId === recipientId) {
    throw forbidden('You cannot send a friend request to yourself')
  }

  const recipient = await userService.getUserById(recipientId)

  if (!recipient) {
    throw userNotFound()
  }

  const existing = await friendshipRepository.getFriendship(requesterId, recipientId)

  if (existing) {
    if (existing.status === 'ACCEPTED') {
      throw forbidden('You are already friends with this user')
    }

    if (existing.status === 'PENDING') {
      throw forbidden('A friend request already exists')
    }

    await friendshipRepository.deleteFriendship(existing.id)
  }

  const friendship = await friendshipRepository.createFriendship(requesterId, recipientId)

  return mapFriendshipResponse(friendship)
}

async function acceptFriendRequest(
  friendshipId: string,
  userId: string,
): Promise<FriendshipResponse> {
  const friendships = await friendshipRepository.getFriendshipsForUser(userId)
  const friendship = friendships.find((item) => item.id === friendshipId)

  if (!friendship) {
    throw forbidden('You do not have permission to accept this friend request')
  }

  if (friendship.recipientId !== userId) {
    throw forbidden('Only the recipient can accept a friend request')
  }

  if (friendship.status !== 'PENDING') {
    throw forbidden('This friend request is no longer pending')
  }

  const updated = await friendshipRepository.updateStatus(friendshipId, 'ACCEPTED')

  return mapFriendshipResponse(updated)
}

async function rejectFriendRequest(
  friendshipId: string,
  userId: string,
): Promise<FriendshipResponse> {
  const friendships = await friendshipRepository.getFriendshipsForUser(userId)
  const friendship = friendships.find((item) => item.id === friendshipId)

  if (!friendship) {
    throw forbidden('You do not have permission to reject this friend request')
  }

  if (friendship.recipientId !== userId) {
    throw forbidden('Only the recipient can reject a friend request')
  }

  if (friendship.status !== 'PENDING') {
    throw forbidden('This friend request is no longer pending')
  }

  const updated = await friendshipRepository.updateStatus(friendshipId, 'REJECTED')

  return mapFriendshipResponse(updated)
}

async function cancelFriendRequest(
  friendshipId: string,
  userId: string,
): Promise<boolean> {
  const friendships = await friendshipRepository.getFriendshipsForUser(userId)
  const friendship = friendships.find((item) => item.id === friendshipId)

  if (!friendship) {
    throw forbidden('You do not have permission to cancel this friend request')
  }

  if (friendship.requesterId !== userId) {
    throw forbidden('Only the requester can cancel a friend request')
  }

  if (friendship.status !== 'PENDING') {
    throw forbidden('This friend request is no longer pending')
  }

  await friendshipRepository.deleteFriendship(friendshipId)

  return true
}

async function getUserFriendships(userId: string): Promise<FriendshipResponse[]> {
  const friendships = await friendshipRepository.getFriendshipsForUser(userId)

  return friendships.map(mapFriendshipResponse)
}

export const friendshipService = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  getUserFriendships,
}
