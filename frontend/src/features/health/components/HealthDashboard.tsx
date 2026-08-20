'use client'

import { Box, Radio, Server } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useHealth } from '../hooks/useHealth'
import { HealthCard } from './HealthCard'

export function HealthDashboard() {
  const { data, isLoading, error } = useHealth()

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <p className="text-muted-foreground">Loading system health...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <h1 className="text-2xl font-bold">System Health</h1>

        <p className="mt-2 text-muted-foreground">Unable to retrieve system health information.</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <p className="text-muted-foreground">No health information available.</p>
      </div>
    )
  }

  const healthy = data.status === 'ok'

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-8 p-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">System Health</h1>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                healthy
                  ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
              }`}
            >
              {healthy ? 'Healthy' : 'Degraded'}
            </span>
          </div>

          <p className="mt-2 text-muted-foreground">
            Live status of the KubeChat application and its infrastructure.
          </p>
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Services</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <HealthCard title="API" status={data.status} description="KubeChat API service" />

            <HealthCard
              title="PostgreSQL"
              status={data.database}
              description="Application database"
            />

            <HealthCard
              title="Redis"
              status={data.redis}
              description="Caching and WebSocket Pub/Sub"
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Running Instance</h2>

          <Card>
            <CardContent className="grid gap-6 pt-6 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <Server className="mt-0.5 h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="text-sm text-muted-foreground">API Instance</p>

                  <p className="mt-1 break-all font-mono text-sm">{data.instance}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Radio className="mt-0.5 h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="text-sm text-muted-foreground">WebSocket Node</p>

                  <p className="mt-1 break-all font-mono text-sm">{data.websocketNode}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Box className="mt-0.5 h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="text-sm text-muted-foreground">Environment</p>

                  <p className="mt-1 font-medium">{data.environment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Kubernetes Architecture</h2>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Running on Kubernetes
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-sm leading-6 text-muted-foreground">
                KubeChat is deployed as containerized services on Kubernetes. Incoming requests are
                routed through a Kubernetes Service to available API pods. Each API instance
                maintains its own WebSocket connections while Redis Pub/Sub distributes message
                events between instances.
              </p>

              <div className="overflow-x-auto rounded-lg border bg-muted/30 p-6">
                <div className="mx-auto flex min-w-[650px] flex-col items-center gap-3 text-sm">
                  <ArchitectureBox
                    icon="frontend"
                    label="KubeChat Frontend"
                    description="Next.js"
                  />

                  <Arrow />

                  <ArchitectureBox
                    icon="service"
                    label="Kubernetes Service"
                    description="Load balances API requests"
                  />

                  <Arrow />

                  <div className="flex gap-4">
                    <ArchitectureBox icon="pod" label="API Pod" description={data.instance} />

                    <ArchitectureBox
                      icon="pod"
                      label="API Pod"
                      description="Additional replicas"
                      muted
                    />
                  </div>

                  <Arrow />

                  <ArchitectureBox icon="redis" label="Redis" description="Pub/Sub" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <ArchitectureDetail
                  title="Kubernetes"
                  description="Container orchestration, service discovery, health probes, and deployment management."
                />

                <ArchitectureDetail
                  title="Redis Pub/Sub"
                  description="Allows WebSocket events to reach clients connected to different API instances."
                />

                <ArchitectureDetail
                  title="Health Probes"
                  description="Kubernetes uses dedicated liveness and readiness endpoints to manage pod health."
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <p className="text-xs text-muted-foreground">
          Last updated: {new Date(data.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

function ArchitectureBox({
  label,
  description,
  muted = false,
}: {
  icon: string
  label: string
  description: string
  muted?: boolean
}) {
  return (
    <div
      className={`w-64 rounded-lg border p-4 text-center ${muted ? 'opacity-50' : 'bg-background'}`}
    >
      <p className="font-semibold">{label}</p>

      <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

function Arrow() {
  return <div className="text-muted-foreground">↓</div>
}

function ArchitectureDetail({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium">{title}</h3>

      <p className="mt-2 text-sm leading-5 text-muted-foreground">{description}</p>
    </div>
  )
}
