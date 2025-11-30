import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string
  fullName: string
  profilePicture?: string
  token: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  isGuest: boolean
  setGuestMode: (isGuest: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      
      login: (user) => set({ user, isAuthenticated: true, isGuest: false }),
      
      logout: () => set({ user: null, isAuthenticated: false, isGuest: false }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      
      setGuestMode: (isGuest) => set({ isGuest, isAuthenticated: false, user: null })
    }),
    {
      name: 'auth-storage'
    }
  )
)
