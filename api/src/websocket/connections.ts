import { WebSocket } from 'ws'

interface UserConnection {
  userId: string
  connectionId: string
  socket: WebSocket
}

export class WebSocketConnectionManager {
  private conversations = new Map<string, Set<WebSocket>>()

  private userConnections = new Map<WebSocket, UserConnection>()

  registerUserConnection(userId: string, connectionId: string, socket: WebSocket): void {
    this.userConnections.set(socket, {
      userId,
      connectionId,
      socket,
    })
  }

  unregisterUserConnection(socket: WebSocket): void {
    this.userConnections.delete(socket)
  }

  getUserConnections(): Array<{ userId: string; connectionId: string }> {
    return Array.from(this.userConnections.values()).map(({ userId, connectionId }) => ({
      userId,
      connectionId,
    }))
  }

  subscribe(conversationId: string, socket: WebSocket): boolean {
    let connections = this.conversations.get(conversationId)

    const wasEmpty = !connections || connections.size === 0

    if (!connections) {
      connections = new Set()

      this.conversations.set(conversationId, connections)
    }

    connections.add(socket)

    return wasEmpty
  }

  unsubscribe(conversationId: string, socket: WebSocket): boolean {
    const connections = this.conversations.get(conversationId)

    if (!connections) {
      return false
    }

    connections.delete(socket)

    if (connections.size === 0) {
      this.conversations.delete(conversationId)

      return true
    }

    return false
  }

  unsubscribeAll(socket: WebSocket): string[] {
    const emptyConversations: string[] = []

    for (const [conversationId, connections] of this.conversations) {
      connections.delete(socket)

      if (connections.size === 0) {
        this.conversations.delete(conversationId)

        emptyConversations.push(conversationId)
      }
    }

    return emptyConversations
  }

  getSubscribedConversationIds(): string[] {
    return Array.from(this.conversations.keys())
  }

  broadcast(conversationId: string, message: string): void {
    const connections = this.conversations.get(conversationId)

    if (!connections) {
      return
    }

    for (const socket of connections) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message)
      }
    }
  }
}
