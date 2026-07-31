import { prisma } from '../../db/prisma'

export async function isDatabaseHealthy() {
  await prisma.$queryRaw`SELECT 1`
}