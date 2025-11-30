import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MessageBubble from '../components/MessageBubble'
import type { Message } from '../types/chat'

describe('MessageBubble', () => {
  const userMessage: Message = {
    id: '1',
    content: 'Hello!',
    senderType: 'USER',
    createdAt: new Date().toISOString(),
    isRead: true,
  }

  const botMessage: Message = {
    id: '2',
    content: 'Hi there! How can I help?',
    senderType: 'BOT',
    intent: 'greeting',
    confidenceScore: 0.95,
    createdAt: new Date().toISOString(),
    isRead: false,
  }

  it('renders user message correctly', () => {
    render(<MessageBubble message={userMessage} isLatest={true} />)
    expect(screen.getByText('Hello!')).toBeInTheDocument()
  })

  it('renders bot message correctly', () => {
    render(<MessageBubble message={botMessage} isLatest={true} />)
    expect(screen.getByText('Hi there! How can I help?')).toBeInTheDocument()
  })

  it('displays confidence score for bot messages', () => {
    render(<MessageBubble message={botMessage} isLatest={true} />)
    expect(screen.getByText(/95% confident/i)).toBeInTheDocument()
  })

  it('renders quick replies when provided', () => {
    const messageWithReplies: Message = {
      ...botMessage,
      quickReplies: ['Help', 'Pricing'],
    }
    
    render(<MessageBubble message={messageWithReplies} isLatest={true} />)
    expect(screen.getByText('Help')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })
})
