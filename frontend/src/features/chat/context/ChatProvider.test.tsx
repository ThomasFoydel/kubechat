import { act, render, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ChatProvider, useChatContext } from './ChatProvider'

const mockSubscribe = vi.fn()
const mockDisconnect = vi.fn()
const mockConnect = vi.fn()

let websocketOptions: {
  onConversationSubscribed: (conversationId: string) => void
  onMessage: (message: unknown) => void
  onStatusChange: (status: unknown) => void
}

vi.mock('../api/chat-websocket.client', () => ({
  ChatWebSocketClient: class {
    constructor(options: typeof websocketOptions) {
      websocketOptions = options
    }

    connect = mockConnect

    disconnect = mockDisconnect

    subscribe = mockSubscribe
  },
}))

function TestConsumer({ conversationId }: { conversationId: string }) {
  const { subscribe, subscribedConversations } = useChatContext()

  useEffect(() => {
    subscribe(conversationId)
  }, [conversationId, subscribe])

  return (
    <div data-testid="subscribed">
      {subscribedConversations.has(conversationId) ? 'subscribed' : 'not-subscribed'}
    </div>
  )
}

describe('ChatProvider', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('restores a conversation subscription after the WebSocket connects', async () => {
    render(
      <ChatProvider>
        <TestConsumer conversationId="conversation-123" />
      </ChatProvider>,
    )

    expect(mockConnect).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(mockSubscribe).toHaveBeenCalledWith('conversation-123')
    })

    act(() => {
      websocketOptions.onConversationSubscribed('conversation-123')
    })

    await waitFor(() => {
      expect(document.querySelector('[data-testid="subscribed"]')?.textContent).toBe(
        'subscribed',
      )
    })
  })
})
