import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '@/store/chatStore'

const MessageComposer = () => {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { sendMessage, isLoading, setTyping } = useChatStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<number>()

  const emojis = ['👍', '❤️', '😊', '🎉', '👏', '🔥', '✅', '💡', '🚀', '⭐']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput('')
    setTyping(false)
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= 2000) {
      setInput(value)
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150)
      textareaRef.current.style.height = `${newHeight}px`
      
      // Scroll into view on mobile when keyboard appears
      if (window.innerWidth < 768 && newHeight > 48) {
        setTimeout(() => {
          textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }, 100)
      }
    }

    // Send typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    if (value.length > 0) {
      setTyping(true)
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false)
      }, 1000) as unknown as number
    } else {
      setTyping(false)
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Show mobile-friendly alert
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        alert('Voice input is not supported on this device. Please type your message instead.')
      } else {
        alert('Speech recognition is not supported in your browser.')
      }
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + (prev ? ' ' : '') + transcript)
      setIsRecording(false)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      alert('Speech recognition error. Please try again.')
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Handle file upload logic here
      console.log('File selected:', file.name)
      // You can integrate with your backend API to upload the file
    }
  }

  const insertEmoji = (emoji: string) => {
    setInput(prev => prev + emoji)
    setShowEmojiPicker(false)
    textareaRef.current?.focus()
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-1.5 sm:gap-2">
        {/* Emoji Picker Button */}
        <div className="relative hidden sm:block">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg sm:rounded-xl transition-colors touch-target"
            aria-label="Insert emoji"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.button>

          {/* Emoji Picker Dropdown */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 grid grid-cols-5 gap-1 z-50"
              >
                {emojis.map((emoji, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Attachment Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg sm:rounded-xl transition-colors touch-target"
          aria-label="Attach file"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        {/* Input Field */}
        <div className="flex-1 relative min-w-0">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className="w-full resize-none rounded-xl sm:rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed
                     placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
            style={{ 
              minHeight: '40px', 
              maxHeight: '120px',
              WebkitTapHighlightColor: 'transparent',
              fontSize: window.innerWidth < 768 ? '16px' : undefined // Prevents iOS zoom on focus
            }}
            aria-label="Message input"
          />

          {/* Character count */}
          {input.length > 1600 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute bottom-1 right-2 text-[10px] sm:text-xs font-medium pointer-events-none ${
                input.length > 1900 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {input.length}/2000
            </motion.div>
          )}

          {/* Voice Input Indicator */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-red-500/10 rounded-2xl flex items-center justify-center"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Recording...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Voice Input Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleVoiceInput}
          disabled={isLoading || isRecording}
          className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl transition-all touch-target ${
            isRecording
              ? 'bg-red-500 text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800'
          }`}
          aria-label="Voice input"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </motion.button>

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-200 touch-target
            ${input.trim() && !isLoading
              ? 'bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Helpful hints */}
      {input.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1.5 sm:mt-2 flex items-center justify-between text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 px-1"
        >
          <span className="hidden sm:inline">💡 Tip: Use Shift+Enter for new lines</span>
          <span className="sm:ml-auto">Powered by AI</span>
        </motion.div>
      )}
    </form>
  )
}

export default MessageComposer
