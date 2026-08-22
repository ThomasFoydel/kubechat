import { z } from 'zod'

export const healthStatusSchema = z.object({
  status: z.string(),
  service: z.string(),
  environment: z.string(),
  instance: z.string(),
  websocketNode: z.string(),
  database: z.string(),
  redis: z.string(),
  timestamp: z.string(),
})

export type HealthStatus = z.infer<typeof healthStatusSchema>
