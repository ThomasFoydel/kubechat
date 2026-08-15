import { DashboardCard } from '@/features/dashboard/components/DashboardCard'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground">Monitor your KubeChat platform.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="API Status" value="Healthy" />

        <DashboardCard title="Active Users" value="0" />

        <DashboardCard title="Messages" value="0" />
      </div>
    </div>
  )
}
