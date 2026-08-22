import { User } from '../../../generated/prisma'
import { prisma } from '../../db/prisma'

export type UserModel = User

const usersDashboardLimit = 100

async function createUser(
  username: string,
  email: string,
  passwordHash: string,
): Promise<UserModel> {
  return prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  })
}

async function getUserById(id: string): Promise<UserModel | null> {
  return prisma.user.findUnique({
    where: {
      id,
    },
  })
}

async function getUserByEmail(email: string): Promise<UserModel | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

async function getUsers(): Promise<UserModel[]> {
  return prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: usersDashboardLimit,
  })
}

export const userRepository = {
  createUser,
  getUserById,
  getUserByEmail,
  getUsers,
}
