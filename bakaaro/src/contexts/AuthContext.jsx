"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage on app start
    const savedUser = localStorage.getItem("bakaaro_user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        console.log("Restored user from localStorage:", parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("bakaaro_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password, rememberMe = false) => {
    setLoading(true)
    try {
      const response = await axios.post("http://localhost:400/api/auth/login", {
        username,
        password,
      })

      const { user } = response.data
      console.log("Login successful:", user)
      setUser(user)

      // Always save to localStorage for session persistence
      localStorage.setItem("bakaaro_user", JSON.stringify(user))

      setLoading(false)
      return { success: true, user }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message)
      setLoading(false)
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      }
    }
  }

  const logout = () => {
    console.log("Logging out user")
    setUser(null)
    localStorage.removeItem("bakaaro_user")
  }

  const hasRole = (requiredRole) => {
    if (!user) return false
    if (requiredRole === "admin") return user.role === "admin"
    return true
  }

  const value = {
    user,
    login,
    logout,
    hasRole,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
