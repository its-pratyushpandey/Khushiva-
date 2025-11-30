import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '@/store/chatStore'
import type { ChatSession } from '@/types/chat'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

type SortOption = 'recent' | 'oldest' | 'messages' | 'alphabetical'
type FilterOption = 'all' | 'pinned' | 'today' | 'week' | 'month'

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { 
    messages, 
    chatSessions, 
    currentSessionId,
    clearMessages, 
    loadSession, 
    deleteSession,
    renameSession,
    pinSession,
    exportSession,
    clearAllSessions,
  } = useChatStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)

  // Get time-based filter
  const getTimeFilter = (session: ChatSession): boolean => {
    const now = new Date()
    const sessionDate = new Date(session.updatedAt)
    const diffTime = now.getTime() - sessionDate.getTime()
    const diffDays = diffTime / (1000 * 3600 * 24)

    switch (filterBy) {
      case 'pinned':
        return session.isPinned
      case 'today':
        return diffDays < 1
      case 'week':
        return diffDays < 7
      case 'month':
        return diffDays < 30
      default:
        return true
    }
  }

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    let filtered = chatSessions.filter(session => {
      const matchesSearch = 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesSearch && getTimeFilter(session)
    })

    // Sort sessions
    filtered.sort((a, b) => {
      // Pinned always on top
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'messages':
          return b.messageCount - a.messageCount
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [chatSessions, searchQuery, sortBy, filterBy])

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const groups: { [key: string]: ChatSession[] } = {
      pinned: [],
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: [],
    }

    filteredSessions.forEach(session => {
      if (session.isPinned) {
        groups.pinned.push(session)
        return
      }

      const now = new Date()
      const sessionDate = new Date(session.updatedAt)
      const diffTime = now.getTime() - sessionDate.getTime()
      const diffDays = diffTime / (1000 * 3600 * 24)

      if (diffDays < 1) {
        groups.today.push(session)
      } else if (diffDays < 2) {
        groups.yesterday.push(session)
      } else if (diffDays < 7) {
        groups.thisWeek.push(session)
      } else if (diffDays < 30) {
        groups.thisMonth.push(session)
      } else {
        groups.older.push(session)
      }
    })

    return groups
  }, [filteredSessions])

  const handleStartEdit = (session: ChatSession) => {
    setEditingSessionId(session.id)
    setEditingTitle(session.title)
  }

  const handleSaveEdit = (sessionId: string) => {
    if (editingTitle.trim()) {
      renameSession(sessionId, editingTitle.trim())
    }
    setEditingSessionId(null)
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId)
    setShowDeleteConfirm(null)
  }

  const handleExportAllSessions = () => {
    const dataStr = JSON.stringify(chatSessions, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `all-chats-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const renderSessionGroup = (title: string, sessions: ChatSession[]) => {
    if (sessions.length === 0) return null

    return (
      <div key={title} className="mb-4">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-2">
          {title} ({sessions.length})
        </div>
        <div className="space-y-1">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`relative group rounded-xl transition-all ${
                currentSessionId === session.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent'
              }`}
            >
              {/* Delete Confirmation Overlay */}
              <AnimatePresence>
                {showDeleteConfirm === session.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-red-500/95 dark:bg-red-600/95 rounded-xl z-10 flex items-center justify-center p-3"
                  >
                    <div className="text-center">
                      <p className="text-white text-sm font-medium mb-2">Delete this chat?</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="px-3 py-1 bg-white text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1 bg-red-700 text-white rounded-lg text-xs font-medium hover:bg-red-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0 pr-2">
                    {editingSessionId === session.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => handleSaveEdit(session.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(session.id)
                          if (e.key === 'Escape') setEditingSessionId(null)
                        }}
                        autoFocus
                        className="w-full bg-white dark:bg-gray-700 border border-primary-300 dark:border-primary-600 rounded px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <button
                        onClick={() => loadSession(session.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center space-x-2">
                          {session.isPinned && (
                            <svg className="w-3 h-3 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 2a.75.75 0 01.75.75v8.59l3.72-3.72a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-1.06 0l-5-5a.75.75 0 111.06-1.06l3.72 3.72V2.75A.75.75 0 0110 2z" />
                            </svg>
                          )}
                          <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {session.title}
                          </h3>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => pinSession(session.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title={session.isPinned ? 'Unpin' : 'Pin'}
                    >
                      <svg className={`w-3.5 h-3.5 ${session.isPinned ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a.75.75 0 01.75.75v8.59l3.72-3.72a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-1.06 0l-5-5a.75.75 0 111.06-1.06l3.72 3.72V2.75A.75.75 0 0110 2z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleStartEdit(session)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Rename"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="More options"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => loadSession(session.id)}
                  className="w-full text-left"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.preview}
                  </p>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="text-xs text-gray-400">{formatRelativeTime(session.updatedAt)}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{session.messageCount} msgs</span>
                    {session.tags.length > 0 && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <div className="flex items-center space-x-1">
                          {session.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                              {tag}
                            </span>
                          ))}
                          {session.tags.length > 2 && (
                            <span className="text-xs text-gray-400">+{session.tags.length - 2}</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </button>

                {/* Expanded Options */}
                <AnimatePresence>
                  {expandedSession === session.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => exportSession(session.id)}
                          className="flex items-center justify-center space-x-1 px-2 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Export</span>
                        </button>
                        
                        <button
                          onClick={() => setShowDeleteConfirm(session.id)}
                          className="flex items-center justify-center space-x-1 px-2 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded text-xs transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden touch-target"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:sticky top-0 left-0 h-screen w-64 sm:w-72 md:w-64 lg:w-72 xl:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 flex flex-col shadow-xl lg:shadow-none overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Conversations</span>
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearMessages}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2.5 rounded-xl font-medium hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </motion.button>

          {/* Search */}
          <div className="mt-3 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white placeholder:text-gray-400"
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter & Sort Controls */}
          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showFilters 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="messages">Most Messages</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-1.5">
                  {(['all', 'pinned', 'today', 'week', 'month'] as FilterOption[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFilterBy(filter)}
                      className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                        filterBy === filter
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat List */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-3 py-2 sm:py-3 space-y-1.5 sm:space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y'
          }}
        >
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No chats found' : 'No conversations yet'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
              </p>
            </div>
          ) : (
            <>
              {renderSessionGroup('Pinned', groupedSessions.pinned)}
              {renderSessionGroup('Today', groupedSessions.today)}
              {renderSessionGroup('Yesterday', groupedSessions.yesterday)}
              {renderSessionGroup('This Week', groupedSessions.thisWeek)}
              {renderSessionGroup('This Month', groupedSessions.thisMonth)}
              {renderSessionGroup('Older', groupedSessions.older)}
            </>
          )}

          {/* Current Active Chat Indicator */}
          {messages.length > 0 && !currentSessionId && (
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-dashed border-primary-300 dark:border-primary-700">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="font-medium text-sm text-primary-900 dark:text-primary-100">
                  Active Session
                </h3>
              </div>
              <p className="text-xs text-primary-700 dark:text-primary-300">
                {messages.length} message{messages.length !== 1 ? 's' : ''} (Not saved yet)
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats & Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-primary-700 dark:text-primary-300">{chatSessions.length}</div>
              <div className="text-xs text-primary-600 dark:text-primary-400">Total</div>
            </div>
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-secondary-700 dark:text-secondary-300">{chatSessions.filter(s => s.isPinned).length}</div>
              <div className="text-xs text-secondary-600 dark:text-secondary-400">Pinned</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-green-700 dark:text-green-300">{messages.length}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Active</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportAllSessions}
              disabled={chatSessions.length === 0}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export All</span>
            </button>
            
            <button
              onClick={() => {
                if (confirm('Clear all conversation history? This cannot be undone.')) {
                  clearAllSessions()
                }
              }}
              disabled={chatSessions.length === 0}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 dark:text-red-400 rounded-lg text-xs font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
