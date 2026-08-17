import { MessageSquare } from 'lucide-react'

export function EmptyChat() {
  return (
    <div className="text-center">
      <MessageSquare size={32} className="mx-auto mb-3 text-muted-foreground" />

      <p className="text-sm text-muted-foreground">Select a conversation</p>
    </div>
  )
}
