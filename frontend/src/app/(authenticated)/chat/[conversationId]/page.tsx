import { ChatPage } from '@/features/chat/components/ChatPage'

interface ChatRouteProps {
  params: Promise<{
    conversationId: string
  }>
}

export default async function ChatRoute({ params }: ChatRouteProps) {
  const { conversationId } = await params

  return <ChatPage conversationId={conversationId} />
}
