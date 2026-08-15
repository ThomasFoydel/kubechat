import { prisma } from '../../db/prisma'
import { redis } from '../../db/redis'

export async function isDatabaseHealthy() {
  await prisma.$queryRaw`SELECT 1`
}

export async function isRedisHealthy() {
  await redis.ping()
}
