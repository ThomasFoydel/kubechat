import { User } from '../../../generated/prisma'
import { prisma } from '../../db/prisma'

export type UserModel = User

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

export const userRepository = {
  createUser,
  getUserById,
  getUserByEmail,
}
