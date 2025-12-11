import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiTruck, FiBarChart2, FiBell } from 'react-icons/fi'
import useAuth from '../hooks/useAuth'
import { authAPI } from '../services/api'
import '../styles/pages/LoginPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
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

      // Get current user to check role
      const res = await authAPI.getCurrentUser()
      if (res.data.role === 'ADMIN') nav('/admin')
      else nav('/home')

    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Login failed. Check credentials.'
      setError(String(msg))
    } finally { setLoading(false) }
  }

  return (
    <div className="login-page">
      {/* Left Branding Section */}
      <div className="login-branding">
        <div className="login-logo">AutoLog</div>
        <p className="login-tagline">Smart Vehicle Maintenance Made Simple</p>

        <div className="login-features">
          <div className="feature-item">
            <div className="feature-icon">
              <FiTruck />
            </div>
            <div className="feature-text">
              <h3>Multi-Vehicle Support</h3>
              <p>Manage all your vehicles in one place</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <FiBarChart2 />
            </div>
            <div className="feature-text">
              <h3>Smart Analytics</h3>
              <p>Track expenses and optimize costs</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <FiBell />
            </div>
            <div className="feature-text">
              <h3>Predictive Alerts</h3>
              <p>Never miss a service again</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to AutoLog</p>
          </div>

          <form onSubmit={onSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="signup-link">
            Don't have an account? <Link to="/signup">Create one now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
