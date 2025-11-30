import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '@/store/chatStore'
import MessageBubble from './MessageBubble'
import MessageComposer from './MessageComposer'
import TypingIndicator from './TypingIndicator'
import CelebrationAnimation from './CelebrationAnimation'

const ChatWindow = () => {
  const { messages, isTyping } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<'success' | 'milestone' | 'achievement' | 'welcome'>('success')
  const previousMessageCount = useRef(0)

  // Filter out duplicate messages based on ID (safeguard)
  const uniqueMessages = messages.filter((message, index, self) => 
    index === self.findIndex((m) => m.id === message.id)
  )

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom && uniqueMessages.length > 0)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [uniqueMessages, isTyping])

  // Celebration triggers
  useEffect(() => {
    const currentCount = uniqueMessages.length
    const previousCount = previousMessageCount.current

    // First message - welcome celebration
    if (currentCount === 1 && previousCount === 0) {
      setCelebrationType('welcome')
      setShowCelebration(true)
    }
    // Every 5 messages - milestone celebration
    else if (currentCount > 0 && currentCount % 5 === 0 && currentCount > previousCount) {
      setCelebrationType('milestone')
      setShowCelebration(true)
    }
    // Every 10 messages - achievement celebration
    else if (currentCount > 0 && currentCount % 10 === 0 && currentCount > previousCount) {
      setCelebrationType('achievement')
      setShowCelebration(true)
    }

    previousMessageCount.current = currentCount
  }, [uniqueMessages.length])

  // Test celebration button
  const triggerTestCelebration = (type: 'success' | 'milestone' | 'achievement' | 'welcome') => {
    setCelebrationType(type)
    setShowCelebration(true)
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
  }

  return (
    <div className="flex flex-col h-full w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 transition-all hover:shadow-3xl">
      {/* Celebration Animation */}
      <CelebrationAnimation 
        show={showCelebration}
        trigger={celebrationType}
        onComplete={handleCelebrationComplete}
        duration={3000}
      />
      
      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y'
        }}
      >
        <AnimatePresence initial={false}>
          {uniqueMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-full text-center py-4 sm:py-6 md:py-8 px-3 sm:px-4"
            >
              {/* Welcome Screen */}
              <motion.div
                animate={{ 
                  scale: [1, 1.08, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 sm:mb-4 shadow-2xl"
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </motion.div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent">
                Welcome to Khushiva AI
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4 sm:mb-6 px-3 sm:px-4 text-xs sm:text-sm">
                Your intelligent AI companion powered by Google Gemini 2.5 Flash. Experience the future of conversational AI with Khushiva!
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full max-w-3xl px-3 sm:px-4 mb-4 sm:mb-6">
                {[
                  { icon: '⚡', title: 'Fast Responses', desc: 'Get instant AI-powered answers' },
                  { icon: '🎯', title: 'Context Aware', desc: 'Remembers conversation context' },
                  { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected' }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Celebration Test Buttons */}
              <div className="w-full max-w-3xl px-3 sm:px-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                  🎉 Try Celebration Animations:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => triggerTestCelebration('welcome')}
                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    🎉 Welcome
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => triggerTestCelebration('success')}
                    className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    ✨ Success
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => triggerTestCelebration('milestone')}
                    className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    🎯 Milestone
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => triggerTestCelebration('achievement')}
                    className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-xs font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    🏆 Achievement
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {uniqueMessages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLatest={index === uniqueMessages.length - 1}
            />
          ))}
        </AnimatePresence>

        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-16 sm:bottom-20 right-3 sm:right-4 md:right-6 w-12 h-12 bg-white dark:bg-gray-800 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-full shadow-lg hover:shadow-xl active:shadow-md transition-all flex items-center justify-center z-10 touch-target"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              bottom: 'max(4rem, calc(4rem + env(safe-area-inset-bottom, 0px)))' 
            }}
            aria-label="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3">
          <MessageComposer />
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
