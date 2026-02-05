import { createContext, useContext, useState, useEffect } from 'react'
import backendService from '../services/backendService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  const loadUser = async () => {
    try {
      const userData = await backendService.getProfile()
      setUser(userData)
    } catch (error) {
      localStorage.removeItem('auth_token')
    }
    setLoading(false)
  }

  const login = async (credentials) => {
    const { user, token } = await backendService.login(credentials)
    localStorage.setItem('auth_token', token)
    setUser(user)
    return user
  }

  const register = async (userData) => {
    const { user, token } = await backendService.register(userData)
    localStorage.setItem('auth_token', token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}