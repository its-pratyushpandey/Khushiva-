import { motion } from 'framer-motion'

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-1.5 sm:gap-2"
    >
      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full typing-dot"></div>
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full typing-dot"></div>
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full typing-dot"></div>
      </div>
    </motion.div>
  )
}

export default TypingIndicator
