import { motion } from 'framer-motion'
import { useChatStore } from '@/store/chatStore'

interface QuickRepliesProps {
  replies: string[]
}

const QuickReplies = ({ replies }: QuickRepliesProps) => {
  const { sendMessage } = useChatStore()

  const handleQuickReply = (reply: string) => {
    sendMessage(reply)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-1.5 sm:gap-2 mt-2"
    >
      {replies.map((reply, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgb(59 130 246)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleQuickReply(reply)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-100 hover:bg-primary-500 text-primary-700 hover:text-white 
                   rounded-full text-xs sm:text-sm font-medium transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 touch-target"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {reply}
        </motion.button>
      ))}
    </motion.div>
  )
}

export default QuickReplies
