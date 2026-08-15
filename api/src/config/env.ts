import { randomUUID } from 'crypto'

function requireEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const config = {
  port: Number(process.env.PORT ?? 3000),

  nodeEnv: process.env.NODE_ENV ?? 'development',

  redisUrl: requireEnv('REDIS_URL'),

  databaseUrl: requireEnv('DATABASE_URL'),

  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  sessionSecret: requireEnv('SESSION_SECRET'),

  sessionTtlSeconds: 60 * 60 * 24 * 7,

  websocketNodeId: process.env.WEBSOCKET_NODE_ID ?? process.env.HOSTNAME ?? randomUUID(),
}
