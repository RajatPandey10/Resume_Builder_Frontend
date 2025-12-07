"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AuthResponse } from "./types"
import { api } from "./api"

interface AuthContextType {
  user: AuthResponse | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const profile = await api.getProfile()
          setUser({ ...profile, token })
        } catch {
          localStorage.removeItem("token")
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password })
    localStorage.setItem("token", response.token)
    setUser(response)
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await api.register({ name, email, password })
    localStorage.setItem("token", response.token)
    setUser(response)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const refreshUser = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const profile = await api.getProfile()
      setUser({ ...profile, token })
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
        refreshUser,
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
