export interface Message {
  id: string
  content: string
  senderType: 'USER' | 'BOT' | 'SYSTEM'
  intent?: string
  confidenceScore?: number
  isRead?: boolean
  createdAt: string
  quickReplies?: string[]
  entities?: EntityInfo[]
  source?: 'rule' | 'nlp' | 'llm'
}

export interface EntityInfo {
  type: string
  value: string
  startPosition?: number
  endPosition?: number
}

export interface ChatRequest {
  sessionId: string
  message: string
  userIdentifier?: string
}

export interface ChatResponse {
  messageId: string
  sessionId: string
  response: string
  intent: string
  confidence: number
  quickReplies?: string[]
  entities?: EntityInfo[]
  source: 'rule' | 'nlp' | 'llm'
  timestamp: string
  requiresFollowup: boolean
}

export interface Session {
  id: string
  userIdentifier: string
  isActive: boolean
  messages: Message[]
  createdAt: string
  updatedAt: string
  lastActivityAt: string
}

export interface ChatSession {
  id: string
  title: string
  preview: string
  messages: Message[]
  createdAt: string
  updatedAt: string
  messageCount: number
  isPinned: boolean
  tags: string[]
}

export interface TypingEvent {
  sessionId: string
  userIdentifier: string
  isTyping: boolean
}
