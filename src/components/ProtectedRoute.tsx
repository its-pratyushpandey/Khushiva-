import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowGuest?: boolean
}

const ProtectedRoute = ({ children, allowGuest = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isGuest } = useAuthStore()

  // If guest access is allowed, permit both authenticated users and guests
  if (allowGuest && (isAuthenticated || isGuest)) {
    return <>{children}</>
  }

  // If guest access is not allowed, only permit authenticated users
  if (!allowGuest && isAuthenticated) {
    return <>{children}</>
  }

  // Redirect to login if not authorized
  return <Navigate to="/login" replace />
}

export default ProtectedRoute
