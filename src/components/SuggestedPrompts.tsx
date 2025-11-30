import { motion } from 'framer-motion'
import { useChatStore } from '@/store/chatStore'

const prompts = [
  {
    icon: '💡',
    title: 'Explain a concept',
    text: 'Explain quantum computing in simple terms',
    category: 'Education'
  },
  {
    icon: '🔍',
    title: 'Get product info',
    text: 'What are your pricing plans?',
    category: 'Product'
  },
  {
    icon: '🛠️',
    title: 'Technical support',
    text: 'How do I integrate your API?',
    category: 'Support'
  },
  {
    icon: '📊',
    title: 'Compare options',
    text: 'Compare machine learning vs deep learning',
    category: 'Analysis'
  },
  {
    icon: '✨',
    title: 'Creative help',
    text: 'Help me brainstorm marketing ideas',
    category: 'Creative'
  },
  {
    icon: '📝',
    title: 'Documentation',
    text: 'Show me getting started guide',
    category: 'Docs'
  }
]

const SuggestedPrompts = () => {
  const { sendMessage } = useChatStore()

  const handlePromptClick = (promptText: string) => {
    sendMessage(promptText)
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
        Suggested Prompts
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {prompts.map((prompt, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePromptClick(prompt.text)}
            className="group relative p-3 sm:p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 active:border-primary-600 transition-all text-left overflow-hidden touch-target min-h-[80px] sm:min-h-[100px]"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform" />
            <div className="relative">
              <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                <span className="text-xl sm:text-2xl">{prompt.icon}</span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                  {prompt.category}
                </span>
              </div>
              <h4 className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                {prompt.title}
              </h4>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {prompt.text}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default SuggestedPrompts
