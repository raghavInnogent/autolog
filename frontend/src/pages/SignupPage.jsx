import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiPhone, FiTruck, FiBarChart2, FiBell } from 'react-icons/fi'
import { usersAPI, authAPI } from '../services/api'
import '../styles/pages/SignupPage.css'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contactError, setContactError] = useState('')
  const nav = useNavigate()

  // Validate contact number
  const validateContactNo = (value) => {
    const phoneRegex = /^[0-9]{10}$/
    if (!value) {
      setContactError('')
      return true
    }
    if (!phoneRegex.test(value)) {
      setContactError('Please enter a valid 10-digit contact number')
      return false
    }
    setContactError('')
    return true
  }

  // Handle contact number change
  const handleContactChange = (e) => {
    const value = e.target.value
    // Only allow numbers
    if (value === '' || /^[0-9]*$/.test(value)) {
      setContactNo(value)
      validateContactNo(value)
    }
  }

  async function handleSendOtp(e) {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authAPI.sendOtp(email)
      setOtpSent(true)
      setShowOtpModal(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP')
    } finally { setLoading(false) }
  }

  async function handleVerifyOtp() {
    if (!otp) {
      setError('Please enter the OTP')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authAPI.verifyOtp(email, otp)
      setOtpVerified(true)
      setShowOtpModal(false)
      setOtp('')
    } catch (err) {
      setShowOtpModal(false)
      setError('Invalid OTP')
      setOtp('')
    } finally { setLoading(false) }
  }

  async function handleCreateAccount(e) {
    e.preventDefault()
    setError('')

    // Validate contact number before submission
    if (!validateContactNo(contactNo)) {
      setError('Please fix the contact number error before proceeding')
      return
    }

    setLoading(true)
    try {
      await usersAPI.create({ name, email, password, contactNo })
      nav('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="signup-page">
      {/* Left Branding Section */}
      <div className="signup-branding">
        <div className="signup-logo">AutoLog</div>
        <p className="signup-tagline">Start Your Journey to Smarter Vehicle Management</p>

        <div className="signup-features">
          <div className="signup-feature-item">
            <div className="signup-feature-icon">
              <FiTruck />
            </div>
            <div className="signup-feature-text">
              <h3>Track All Vehicles</h3>
              <p>Manage unlimited vehicles effortlessly</p>
            </div>
          </div>

          <div className="signup-feature-item">
            <div className="signup-feature-icon">
              <FiBarChart2 />
            </div>
            <div className="signup-feature-text">
              <h3>Cost Insights</h3>
              <p>Detailed analytics and reports</p>
            </div>
          </div>

          <div className="signup-feature-item">
            <div className="signup-feature-icon">
              <FiBell />
            </div>
            <div className="signup-feature-text">
              <h3>Smart Reminders</h3>
              <p>Never forget maintenance again</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="signup-form-section">
        <div className="signup-form-container">
          <div className="signup-form-header">
            <h2>Create Account</h2>
            <p>Join AutoLog and take control of your vehicle maintenance</p>
          </div>

          <form onSubmit={otpVerified ? handleCreateAccount : handleSendOtp} className="signup-form">
            <div className="signup-form-group">
              <label>Full Name</label>
              <div className="signup-input-wrapper">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
                <FiUser className="signup-input-icon" />
              </div>
            </div>

            <div className="signup-form-group">
              <label>Email Address</label>
              <div className="signup-input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={otpVerified}
                  placeholder="Enter your email"
                />
                <FiMail className="signup-input-icon" />
              </div>
            </div>

            <div className="signup-form-group">
              <label>Password</label>
              <div className="signup-input-wrapper">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Create a strong password"
                />
                <FiLock className="signup-input-icon" />
              </div>
            </div>

            <div className="signup-form-group">
              <label>Contact Number</label>
              <div className="signup-input-wrapper">
                <input
                  value={contactNo}
                  onChange={handleContactChange}
                  onBlur={() => validateContactNo(contactNo)}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className={contactError ? 'error' : ''}
                />
                <FiPhone className="signup-input-icon" />
              </div>
              {contactError && <div className="field-error">{contactError}</div>}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="signup-button" disabled={loading || (otpVerified && contactError)}>
              {loading ? 'Processing...' : (otpVerified ? 'Create Account' : 'Send OTP')}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal">
            <h3>Verify OTP</h3>
            <p>Enter the OTP sent to {email}</p>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
              maxLength={4}
              className="otp-input"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '24px',
                textAlign: 'center',
                letterSpacing: '8px',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                marginBottom: '24px',
                fontWeight: '700'
              }}
            />
            <div className="otp-modal-buttons">
              <button
                onClick={() => { setShowOtpModal(false); setOtp('') }}
                className="otp-cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="otp-verify-button"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
