import type {
  ClientMessage,
  ServerMessage
} from '../types/websocket.protocol'

export type WebSocketConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error'

export interface ChatWebSocketClientOptions {
  onMessage: (message: ServerMessage) => void
  onStatusChange: (
    status: WebSocketConnectionStatus
  ) => void
}

const INITIAL_RECONNECT_DELAY = 1_000
const MAX_RECONNECT_DELAY = 30_000

function getWebSocketUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_WS_URL

  if (configuredUrl) {
    return configuredUrl
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    'https://kubechat.duckdns.org'

  const url = new URL(apiUrl)

  url.protocol =
    url.protocol === 'https:'
      ? 'wss:'
      : 'ws:'

  url.pathname = '/ws'
  url.search = ''

  return url.toString()
}

function parseServerMessage(
  data: string
): ServerMessage | null {
  try {
    const parsed: unknown = JSON.parse(data)

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('type' in parsed) ||
      typeof parsed.type !== 'string'
    ) {
      return null
    }

    return parsed as ServerMessage
  } catch {
    return null
  }
}

export class ChatWebSocketClient {
  private socket: WebSocket | null = null

  private reconnectTimer:
    ReturnType<typeof setTimeout> | null =
    null

  private reconnectAttempt = 0

  private manuallyClosed = false

  private subscribedConversations =
    new Set<string>()

  private readonly options:
    ChatWebSocketClientOptions

  constructor(
    options: ChatWebSocketClientOptions
  ) {
    this.options = options
  }

  connect(): void {
    if (
      this.socket?.readyState ===
        WebSocket.OPEN ||
      this.socket?.readyState ===
        WebSocket.CONNECTING
    ) {
      return
    }

    this.manuallyClosed = false

    this.options.onStatusChange(
      this.reconnectAttempt > 0
        ? 'reconnecting'
        : 'connecting'
    )

    const socket = new WebSocket(
      getWebSocketUrl()
    )

    this.socket = socket

    socket.addEventListener(
      'open',
      () => {
        this.reconnectAttempt = 0

        this.options.onStatusChange(
          'connected'
        )

        this.resubscribe()
      }
    )

    socket.addEventListener(
      'message',
      event => {
        const message =
          parseServerMessage(
            String(event.data)
          )

        if (!message) {
          console.error(
            'Received invalid WebSocket message'
          )

          return
        }

        this.options.onMessage(message)
      }
    )

    socket.addEventListener(
      'error',
      () => {
        this.options.onStatusChange(
          'error'
        )
      }
    )

    socket.addEventListener(
      'close',
      () => {
        if (this.socket === socket) {
          this.socket = null
        }

        if (this.manuallyClosed) {
          this.options.onStatusChange(
            'disconnected'
          )

          return
        }

        this.scheduleReconnect()
      }
    )
  }

  disconnect(): void {
    this.manuallyClosed = true

    this.clearReconnectTimer()

    const socket = this.socket

    this.socket = null

    if (socket) {
      socket.close()
    }

    this.options.onStatusChange(
      'disconnected'
    )
  }

  subscribe(
    conversationId: string
  ): void {
    this.subscribedConversations.add(
      conversationId
    )

    if (this.isConnected()) {
      this.send({
        type:
          'conversation.subscribe',
        conversationId
      })
    }
  }

  unsubscribe(
    conversationId: string
  ): void {
    this.subscribedConversations.delete(
      conversationId
    )

    if (this.isConnected()) {
      this.send({
        type:
          'conversation.unsubscribe',
        conversationId
      })
    }
  }

  sendMessage(
    conversationId: string,
    content: string,
    clientMessageId: string
  ): void {
    this.send({
      type: 'message.send',
      conversationId,
      content,
      clientMessageId
    })
  }

  private isConnected(): boolean {
    return (
      this.socket?.readyState ===
      WebSocket.OPEN
    )
  }

  private send(
    message: ClientMessage
  ): void {
    if (!this.isConnected()) {
      throw new Error(
        'WebSocket is not connected'
      )
    }

    this.socket!.send(
      JSON.stringify(message)
    )
  }

  private resubscribe(): void {
    for (const conversationId of this
      .subscribedConversations) {
      this.send({
        type:
          'conversation.subscribe',
        conversationId
      })
    }
  }

  private scheduleReconnect(): void {
    if (this.manuallyClosed) {
      return
    }

    this.clearReconnectTimer()

    const delay = Math.min(
      INITIAL_RECONNECT_DELAY *
        2 ** this.reconnectAttempt,
      MAX_RECONNECT_DELAY
    )

    this.reconnectAttempt += 1

    this.reconnectTimer =
      setTimeout(() => {
        this.reconnectTimer = null
        this.connect()
      }, delay)
  }

  private clearReconnectTimer(): void {
    if (!this.reconnectTimer) {
      return
    }

    clearTimeout(
      this.reconnectTimer
    )

    this.reconnectTimer = null
  }
}
