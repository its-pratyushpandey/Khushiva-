import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatWindow from '../components/ChatWindow'
import Sidebar from '../components/Sidebar'
import SettingsPanel from '../components/SettingsPanel'
import ThemeToggle from '../components/ThemeToggle'
import Preloader from '../components/Preloader'
import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'
import { motion, AnimatePresence } from 'framer-motion'

function Home() {
  const { isConnected, initializeWebSocket, messages } = useChatStore()
  const { isAuthenticated, isGuest, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    initializeWebSocket()
  }, [initializeWebSocket])

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  if (isLoading) {
    return <Preloader onLoadComplete={handleLoadComplete} />
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Fixed Navbar for Mobile, Relative for Desktop */}
      <header className="fixed top-0 left-0 right-0 lg:relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800 z-[100] transition-all safe-top">
        <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Left Section - Menu Button First on Mobile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Menu Button - Top Left on Mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all touch-target order-first"
                aria-label="Toggle menu"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </motion.div>
                <div>
                  <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent leading-tight">
                    Khushiva AI
                  </h1>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {isConnected ? '● Online' : '● Offline'}
                    </span>
                    {messages.length > 0 && (
                      <span className="hidden md:inline text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                        • {messages.length} messages
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Always Visible Theme Toggle */}
            <div className="flex items-center gap-2">
              {/* Auth Status */}
              {isGuest && !isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </motion.button>
              )}

              {isAuthenticated && user && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.fullName} 
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.fullName.split(' ')[0]}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Theme Toggle - Always Visible */}
              <ThemeToggle />
              
              {/* Settings Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-all touch-target ${
                  showSettings 
                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                aria-label="Settings"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-full w-full overflow-hidden pt-[60px] lg:pt-0">
        {/* Sidebar */}
        <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden flex bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-950/50 dark:to-gray-900/50">
            <div className="flex-1 flex flex-col p-1.5 sm:p-2 md:p-3 lg:p-4 overflow-hidden">
              <ChatWindow />
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="hidden lg:block"
                >
                  <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 touch-target"
            onClick={() => setShowSettings(false)}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] sm:max-h-[80vh] overflow-auto"
            >
              <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home
