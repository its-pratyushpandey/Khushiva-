import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { ChatResponse, TypingEvent } from '@/types/chat'

const WS_URL = import.meta.env.VITE_WS_URL || 'https://khushiva.onrender.com/ws/chat'

export class WebSocketService {
  private client: Client | null = null
  private messageCallback: ((message: ChatResponse) => void) | null = null
  private typingCallback: ((event: TypingEvent) => void) | null = null
  private connectionCallback: ((connected: boolean) => void) | null = null

  connect(
    onMessage: (message: ChatResponse) => void,
    onTyping: (event: TypingEvent) => void,
    onConnection: (connected: boolean) => void
  ) {
    this.messageCallback = onMessage
    this.typingCallback = onTyping
    this.connectionCallback = onConnection

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: () => {
        console.log('WebSocket connected')
        this.connectionCallback?.(true)

        this.client?.subscribe('/topic/messages', (message: IMessage) => {
          const chatResponse: ChatResponse = JSON.parse(message.body)
          this.messageCallback?.(chatResponse)
        })

        this.client?.subscribe('/topic/typing', (message: IMessage) => {
          const typingEvent: TypingEvent = JSON.parse(message.body)
          this.typingCallback?.(typingEvent)
        })
      },

      onDisconnect: () => {
        console.log('WebSocket disconnected')
        this.connectionCallback?.(false)
      },

      onStompError: (frame) => {
        console.error('WebSocket error:', frame)
        this.connectionCallback?.(false)
      },
    })

    this.client.activate()
  }

  sendMessage(sessionId: string, message: string, userIdentifier: string) {
    if (this.client?.connected) {
      this.client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({
          sessionId,
          message,
          userIdentifier,
        }),
      })
    }
  }

  sendTyping(sessionId: string, userIdentifier: string, isTyping: boolean) {
    if (this.client?.connected) {
      this.client.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({
          sessionId,
          userIdentifier,
          isTyping,
        }),
      })
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate()
      this.client = null
    }
  }

  isConnected(): boolean {
    return this.client?.connected || false
  }
}

export const webSocketService = new WebSocketService()
