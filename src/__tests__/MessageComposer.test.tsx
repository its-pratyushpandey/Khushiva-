import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MessageComposer from '../components/MessageComposer'

// Mock the store
vi.mock('../store/chatStore', () => ({
  useChatStore: () => ({
    sendMessage: vi.fn(),
    isLoading: false,
    setTyping: vi.fn(),
  }),
}))

describe('MessageComposer', () => {
  it('renders textarea and send button', () => {
    render(<MessageComposer />)
    
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/send message/i)).toBeInTheDocument()
  })

  it('updates input value when typing', async () => {
    const user = userEvent.setup()
    render(<MessageComposer />)
    
    const textarea = screen.getByPlaceholderText(/type your message/i) as HTMLTextAreaElement
    await user.type(textarea, 'Hello')
    
    expect(textarea.value).toBe('Hello')
  })

  it('enables send button when input has text', async () => {
    const user = userEvent.setup()
    render(<MessageComposer />)
    
    const textarea = screen.getByPlaceholderText(/type your message/i)
    const sendButton = screen.getByLabelText(/send message/i)
    
    expect(sendButton).toBeDisabled()
    
    await user.type(textarea, 'Test message')
    
    expect(sendButton).not.toBeDisabled()
  })
})
