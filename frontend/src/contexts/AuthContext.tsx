import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../services/api'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  googleClientId: string | null | undefined
  loginWithGoogle: (credential: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [googleClientId, setGoogleClientId] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    api.get('/auth/config').then(res => setGoogleClientId(res.data.googleClientId ?? null)).catch(() => setGoogleClientId(null))
  }, [])

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => { localStorage.removeItem('token'); setToken(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  async function loginWithGoogle(credential: string) {
    const res = await api.post('/auth/google', { credential })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  async function refreshUser() {
    const res = await api.get('/auth/me')
    setUser(res.data)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, googleClientId, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
