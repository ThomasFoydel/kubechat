'use client'

import { useState } from 'react'

import { ChatSidebar } from './ChatSidebar'
import { EmptyChat } from './EmptyChat'
import { MessageComposer } from './MessageComposer'

export function ChatPage() {
  const [message, setMessage] = useState('')

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!message.trim()) {
      return
    }

    setMessage('')
  }

  function handleNewChat() {
    // TODO: create/switch to a new chat
  }

  return (
    <div className="flex h-full min-h-0 bg-background text-foreground">
      <ChatSidebar
        onNewChat={handleNewChat}
      />

      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <section className="flex min-h-0 flex-1 items-center justify-center p-4">
          <EmptyChat />
        </section>

        <MessageComposer
          message={message}
          onMessageChange={setMessage}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  )
}