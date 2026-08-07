export interface LiveHealthResponse {
  status: string
  service: string
  timestamp: string
}

export interface ReadyHealthResponse {
  status: string
  service: string
  database: string
  redis: string
  timestamp: string
}

export interface HealthStatus {
  api: {
    status: string
    timestamp: string
  }
  database: string
  redis: string
}