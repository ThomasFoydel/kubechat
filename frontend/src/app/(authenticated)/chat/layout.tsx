'use client'

import { ChatProvider } from '@/features/chat/context/ChatProvider'

export default function ChatRouteLayout({ children }: { children: React.ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>
}
