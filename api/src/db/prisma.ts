import { PrismaClient } from '../../generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from '../config/env'

const adapter = new PrismaPg({
  connectionString: config.databaseUrl
})

export const prisma = new PrismaClient({ adapter })