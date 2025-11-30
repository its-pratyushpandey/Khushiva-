import { useState } from 'react'
import { motion } from 'framer-motion'
import { useChatStore } from '@/store/chatStore'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { clearMessages, messages } = useChatStore()
  const [settings, setSettings] = useState({
    animations: true,
    soundNotifications: true,
    typingIndicator: true,
    autoScroll: true,
    enterToSend: true,
    showTimestamps: true,
    compactMode: false,
    language: 'en',
    fontSize: 'medium'
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const exportChat = () => {
    const chatData = JSON.stringify(messages, null, 2)
    const blob = new Blob([chatData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full lg:w-96 h-full max-h-screen bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-none sm:rounded-2xl shadow-2xl overflow-hidden border-0 sm:border border-gray-200/50 dark:border-gray-700/50"
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-50 via-purple-50 to-secondary-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 active:bg-white/70 dark:active:bg-gray-600 rounded-lg transition-colors touch-target"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] sm:max-h-[calc(100vh-200px)]" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Appearance */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Appearance
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Font Size</span>
              <select
                value={settings.fontSize}
                onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
                className="px-2 sm:px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 dark:text-white touch-target"
                style={{ fontSize: '16px', WebkitTapHighlightColor: 'transparent' }}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-target" style={{ WebkitTapHighlightColor: 'transparent' }}>
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Compact Mode</span>
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={() => toggleSetting('compactMode')}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
            </label>
          </div>
        </section>

        {/* Behavior */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Behavior
          </h3>
          <div className="space-y-3">
            {[
              { key: 'animations', label: 'Enable Animations' },
              { key: 'soundNotifications', label: 'Sound Notifications' },
              { key: 'typingIndicator', label: 'Typing Indicators' },
              { key: 'autoScroll', label: 'Auto Scroll' },
              { key: 'enterToSend', label: 'Enter to Send' },
              { key: 'showTimestamps', label: 'Show Timestamps' }
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-target"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{label}</span>
                <input
                  type="checkbox"
                  checked={settings[key as keyof typeof settings] as boolean}
                  onChange={() => toggleSetting(key as keyof typeof settings)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            Data Management
          </h3>
          <div className="space-y-3">
            <button
              onClick={exportChat}
              disabled={messages.length === 0}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed touch-target"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Export Chat</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all messages?')) {
                  clearMessages()
                }
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl transition-colors touch-target"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Clear All Messages</span>
            </button>
          </div>
        </section>

        {/* About */}
        <section className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">About</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>App Name:</strong> Khushiva AI</p>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>AI Model:</strong> Google Gemini 2.5 Flash</p>
            <p><strong>Backend:</strong> Spring Boot 3.4.0</p>
            <p><strong>Frontend:</strong> React 18 + TypeScript</p>
          </div>
        </section>
      </div>
    </motion.div>
  )
}

export default SettingsPanel
