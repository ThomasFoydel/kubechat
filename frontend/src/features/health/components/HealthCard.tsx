import { StatusBadge } from './StatusBadge'

interface Props {
  name: string
  status: string
}

export function HealthCard({
  name,
  status
}: Props) {
  return (
    <div className="rounded border p-4">
      <h3 className="font-semibold">
        {name}
      </h3>

      <StatusBadge status={status} />
    </div>
  )
}