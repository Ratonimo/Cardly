"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { User } from "./auth"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a mock user that's always logged in
const MOCK_USER: User = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start with the mock user already logged in
  const [user, setUser] = useState<User | null>(MOCK_USER)
  const [loading, setLoading] = useState(false)

  // These functions don't actually do anything now
  const login = async (): Promise<boolean> => {
    return true
  }

  const register = async (): Promise<boolean> => {
    return true
  }

  const logout = () => {
    // We could set user to null here, but let's keep the user logged in
    // setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
