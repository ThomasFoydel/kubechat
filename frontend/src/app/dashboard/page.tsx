export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Monitor your KubeChat platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="API Status"
          value="Healthy"
        />

        <DashboardCard
          title="Active Users"
          value="0"
        />

        <DashboardCard
          title="Messages"
          value="0"
        />
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="rounded-lg border p-6">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  )
}