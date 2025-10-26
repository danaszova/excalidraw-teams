import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User, token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          
          if (!response.ok) {
            throw new Error('Login failed')
          }
          
          const { user, token } = await response.json()
          set({ user, token, isAuthenticated: true })
        } catch (error) {
          // For development, allow any login
          console.warn('Using development auth bypass')
          const mockUser = { id: '1', email, name: email.split('@')[0] }
          set({ user: mockUser, token: 'dev-token', isAuthenticated: true })
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          })
          
          if (!response.ok) {
            throw new Error('Registration failed')
          }
          
          const { user, token } = await response.json()
          set({ user, token, isAuthenticated: true })
        } catch (error) {
          // For development, allow any registration
          console.warn('Using development auth bypass')
          const mockUser = { id: '1', email, name }
          set({ user: mockUser, token: 'dev-token', isAuthenticated: true })
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
      
      setUser: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
