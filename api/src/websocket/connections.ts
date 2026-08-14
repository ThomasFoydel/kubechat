import { WebSocket } from 'ws'

export class WebSocketConnectionManager {
  private conversations = new Map<
    string,
    Set<WebSocket>
  >()

  subscribe(
    conversationId: string,
    socket: WebSocket
  ): boolean {
    let connections =
      this.conversations.get(
        conversationId
      )

    const wasEmpty =
      !connections ||
      connections.size === 0

    if (!connections) {
      connections = new Set()

      this.conversations.set(
        conversationId,
        connections
      )
    }

    connections.add(socket)

    return wasEmpty
  }

  unsubscribe(
    conversationId: string,
    socket: WebSocket
  ): boolean {
    const connections =
      this.conversations.get(
        conversationId
      )

    if (!connections) {
      return false
    }

    connections.delete(socket)

    if (connections.size === 0) {
      this.conversations.delete(
        conversationId
      )

      return true
    }

    return false
  }

  unsubscribeAll(
    socket: WebSocket
  ): string[] {
    const emptyConversations: string[] = []

    for (const [
      conversationId,
      connections
    ] of this.conversations) {
      connections.delete(socket)

      if (connections.size === 0) {
        this.conversations.delete(
          conversationId
        )

        emptyConversations.push(
          conversationId
        )
      }
    }

    return emptyConversations
  }

  getSubscribedConversationIds(): string[] {
    return Array.from(
      this.conversations.keys()
    )
  }

  broadcast(
    conversationId: string,
    message: string
  ): void {
    const connections =
      this.conversations.get(
        conversationId
      )

    if (!connections) {
      return
    }

    for (const socket of connections) {
      if (
        socket.readyState ===
        WebSocket.OPEN
      ) {
        socket.send(message)
      }
    }
  }
}
