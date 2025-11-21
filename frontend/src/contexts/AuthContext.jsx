import React, { createContext, useEffect, useState } from 'react'
import { authAPI } from '../services/api'
export const AuthContext = createContext({ user: null, isAuth: false })
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => { checkAuth() }, [])
  async function checkAuth() {
    try {
      const res = await authAPI.me()
      setUser(res.data)
      setIsAuth(true)
    } catch { setIsAuth(false) }
    finally { setLoading(false) }
  }
  async function login({ email, password }) {
    const res = await authAPI.login(email, password)
    // backend may return either { token, user } or a plain user object
    const data = res?.data
    let user = null
    if (data) {
      if (data.user) user = data.user
      else if (data.id && (data.email || data.name)) user = data
    }
    const token = data?.token
    if (token) localStorage.setItem('autolog_token', token)
    setUser(user)
    setIsAuth(true)
  }
  async function logout() {
    try { await authAPI.logout() } catch (e) { }
    localStorage.removeItem('autolog_token')
    setUser(null); setIsAuth(false)
  }
  return <AuthContext.Provider value={{ user, isAuth, login, logout, loading }}>{children}</AuthContext.Provider>
}
export default AuthProvider