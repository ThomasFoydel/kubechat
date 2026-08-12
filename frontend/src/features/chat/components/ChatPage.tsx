'use client'

import { useState } from 'react'
import { ChatHeader } from './ChatHeader'
import { ChatSidebar } from './ChatSidebar'
import { EmptyChat } from './EmptyChat'
import { MessageComposer } from './MessageComposer'

export function ChatPage() {
  const [message, setMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!message.trim()) {
      return
    }

    setMessage('')
  }

  function handleNewChat() {
    setSidebarOpen(false)
    // TODO: create/switch to a new chat
  }

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <section className="flex flex-1 items-center justify-center p-4">
          <EmptyChat />
        </section>

        <MessageComposer
          message={message}
          onMessageChange={setMessage}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  )
}