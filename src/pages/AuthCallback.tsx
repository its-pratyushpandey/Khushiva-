import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const name = searchParams.get('name')
    const picture = searchParams.get('picture')

    if (token && email) {
      // Store authentication data
      login({
        email,
        fullName: name || email,
        profilePicture: picture || undefined,
        token
      })
      
      // Redirect to home
      setTimeout(() => navigate('/'), 500)
    } else {
      setError('Authentication failed. Invalid callback parameters.')
      setTimeout(() => navigate('/login'), 3000)
    }
  }, [searchParams, login, navigate])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {error ? (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication Failed</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full"
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Completing Sign In...</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we set up your account</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AuthCallback
