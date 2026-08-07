interface Props {
  status: string
}

export function StatusBadge({ status }: Props) {
  const healthy =
    status === 'ok' ||
    status === 'connected'

  return (
    <span>
      {healthy ? '🟢' : '🔴'} {status}
    </span>
  )
}