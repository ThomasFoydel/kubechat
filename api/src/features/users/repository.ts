import { User } from '../../../generated/prisma'
import { prisma } from '../../db/prisma'

export type UserModel = User

async function createUser(username: string): Promise<UserModel> {
  return prisma.user.create({
    data: {
      username
    }
  })
}

async function getUserById(id: string): Promise<UserModel | null> {
  return prisma.user.findUnique({
    where: {
      id
    }
  })
}

export const userRepository = {
  createUser,
  getUserById
}