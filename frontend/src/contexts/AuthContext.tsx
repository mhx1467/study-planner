import React, { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthResponse, LoginRequest, RegisterRequest } from "@/types"
import { apiClient } from "@/services/api"
import { useQueryClient } from "@tanstack/react-query"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          const currentUser = await apiClient.getCurrentUser()
          setUser(currentUser)
          setError(null)
        } catch (err) {
          localStorage.removeItem("access_token")
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [queryClient])

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response: AuthResponse = await apiClient.login(credentials)
      // Invalidate all queries to force refetch with new user's data
      await queryClient.invalidateQueries()
      setUser(response.user)
    } catch (err: any) {
      const message = err.response?.data?.detail || "Login failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response: AuthResponse = await apiClient.register(data)
      // Invalidate all queries to force refetch with new user's data
      await queryClient.invalidateQueries()
      setUser(response.user)
    } catch (err: any) {
      const message = err.response?.data?.detail || "Registration failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      // Invalidate all queries immediately when logging out
      await queryClient.invalidateQueries()
      
      await apiClient.logout()
      setUser(null)
      setError(null)
    } catch (err) {
      // Logout error handled silently
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
