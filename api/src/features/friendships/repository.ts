import { Friendship } from '../../../generated/prisma'
import { prisma } from '../../db/prisma'

export type FriendshipModel = Friendship

async function getFriendship(
  userId: string,
  otherUserId: string,
): Promise<FriendshipModel | null> {
  const direct = await prisma.friendship.findUnique({
    where: {
      requesterId_recipientId: {
        requesterId: userId,
        recipientId: otherUserId,
      },
    },
  })

  if (direct) {
    return direct
  }

  return prisma.friendship.findUnique({
    where: {
      requesterId_recipientId: {
        requesterId: otherUserId,
        recipientId: userId,
      },
    },
  })
}

async function createFriendship(
  requesterId: string,
  recipientId: string,
): Promise<FriendshipModel> {
  return prisma.friendship.create({
    data: {
      requesterId,
      recipientId,
      status: 'PENDING',
    },
  })
}

async function updateStatus(
  id: string,
  status: 'ACCEPTED' | 'REJECTED',
): Promise<FriendshipModel> {
  return prisma.friendship.update({
    where: {
      id,
    },
    data: {
      status,
    },
  })
}

async function deleteFriendship(id: string): Promise<void> {
  await prisma.friendship.delete({
    where: {
      id,
    },
  })
}

async function getFriendshipsForUser(userId: string): Promise<FriendshipModel[]> {
  return prisma.friendship.findMany({
    where: {
      OR: [{ requesterId: userId }, { recipientId: userId }],
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

export const friendshipRepository = {
  getFriendship,
  createFriendship,
  updateStatus,
  deleteFriendship,
  getFriendshipsForUser,
}
