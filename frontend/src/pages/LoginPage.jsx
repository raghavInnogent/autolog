import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuth } = useAuth()
  const nav = useNavigate()

  React.useEffect(() => {
    if (isAuth) nav('/home')
  }, [isAuth, nav])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      nav('/home')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Login failed. Check credentials.'
      setError(String(msg))
    } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 20, background: 'var(--card)', borderRadius: 8, border: '1px solid var(--border)' }}>
      <h2 style={{ marginTop: 0 }}>Sign In</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ fontSize: 13 }}>Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid var(--border)' }} />
        </label>
        <label style={{ fontSize: 13 }}>Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid var(--border)' }} />
        </label>
        {error && <div style={{ color: 'crimson', fontSize: 13 }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="submit" className="navy-btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          <button type="button" onClick={() => nav('/signup')} className="navy-btn">Create account</button>
        </div>
      </form>
    </div>
  )
}
