export interface HealthResponse {
  status: string
  service: string
  timestamp: string
}

export interface ReadyResponse extends HealthResponse {
  database: string
  redis: string
}