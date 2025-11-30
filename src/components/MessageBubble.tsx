import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import type { Message } from '@/types/chat'
import QuickReplies from './QuickReplies'
import { useState } from 'react'

interface MessageBubbleProps {
  message: Message
  isLatest: boolean
}

const MessageBubble = ({ message, isLatest }: MessageBubbleProps) => {
  const isUser = message.senderType === 'USER'
  const isSystem = message.senderType === 'SYSTEM'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Parse content for code blocks and formatting
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    
    return parts.map((part, index) => {
      // Code block
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3)
        const lines = code.split('\n')
        const language = lines[0].trim()
        const codeContent = lines.slice(1).join('\n')
        
        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-lg max-w-full">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800 text-gray-300">
              <span className="font-mono text-xs sm:text-sm font-medium">{language || 'code'}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(codeContent)
                  const btn = event?.target as HTMLButtonElement
                  if (btn) {
                    btn.textContent = '✓ Copied!'
                    setTimeout(() => btn.textContent = 'Copy', 2000)
                  }
                }}
                className="px-3 py-1 text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-lg transition-colors touch-target font-medium"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Copy
              </button>
            </div>
            <div className="relative overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', maxWidth: '100%' }}>
              <pre className="p-3 sm:p-4 bg-gray-900 text-gray-100 text-xs sm:text-sm leading-relaxed min-w-0">
                <code className="font-mono whitespace-pre">{codeContent}</code>
              </pre>
            </div>
          </div>
        )
      }
      
      // Inline code
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-mono text-primary-600 dark:text-primary-400 break-words inline-block max-w-full overflow-wrap-anywhere">
            {part.slice(1, -1)}
          </code>
        )
      }
      
      // Bold text
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>
      }
      
      // Italic text
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-gray-700 dark:text-gray-300">{part.slice(1, -1)}</em>
      }
      
      // Regular text - split by newlines
      return part.split('\n').map((line, i, arr) => (
        <span key={`${index}-${i}`} className="break-words">
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))
    })
  }

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex justify-center"
      >
        <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-4 py-2 rounded-full shadow-sm">
          {message.content}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group w-full`}
    >
      <div className={`flex items-end space-x-2 max-w-[90%] sm:max-w-[85%] md:max-w-[75%]`}>
        {/* Avatar */}
        {!isUser && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
            className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </motion.div>
        )}

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
          {/* Message Bubble */}
          <div className="relative group/bubble w-full">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`message-bubble w-full overflow-hidden ${
                isUser
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg border border-gray-200 dark:border-gray-700'
              }`}
              style={{ wordWrap: 'break-word', overflowWrap: 'anywhere' }}
            >
              <div className="text-sm sm:text-base leading-relaxed break-words">
                {renderContent(message.content)}
              </div>

              {/* Action Buttons */}
              {!isUser && (
                <div className="absolute -right-2 top-2 opacity-0 group-hover/bubble:opacity-100 transition-opacity flex flex-col space-y-1">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg shadow-md transition-colors"
                    title="Copy message"
                  >
                    {copied ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

              {/* Confidence Badge */}
              {!isUser && message.confidenceScore && message.confidenceScore > 0 && (
                <div className="mt-3 flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      message.confidenceScore > 0.8 ? 'bg-green-500' : 
                      message.confidenceScore > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {Math.round(message.confidenceScore * 100)}% confident
                    </span>
                  </div>
                  {message.source && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                      {message.source === 'llm' ? '🤖 AI' : message.source === 'nlp' ? '💡 Pattern' : '📚 Rule'}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Quick Replies */}
          {!isUser && isLatest && message.quickReplies && message.quickReplies.length > 0 && (
            <QuickReplies replies={message.quickReplies} />
          )}

          {/* Timestamp */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1"
          >
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </motion.span>
        </div>

        {/* User Avatar */}
        {isUser && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
            className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default MessageBubble
