export interface HealthStatus {
  status: string
  service: string
  environment: string
  instance: string
  websocketNode: string
  database: string
  redis: string
  timestamp: string
}
