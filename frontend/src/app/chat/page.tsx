import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { ChatPage } from '@/features/chat/components/ChatPage'

export default function ChatRoute() {
  return (
    <RequireAuth>
      <ChatPage />
    </RequireAuth>
  )
}