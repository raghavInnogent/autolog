import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiBell, FiUser, FiMenu, FiLogOut } from 'react-icons/fi'
import NotificationBell from './NotificationBell'
import useAuth from '../hooks/useAuth'
import autoLogLogo from '../assets/autolog_logo.png'
import '../styles/components/Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuth, logout } = useAuth()
  const nav = useNavigate()
  const menuRef = useRef()

  useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  function handleLogout() {
    logout()
    setOpen(false)
    nav('/')
  }

  return (
    <header className="autolog-navbar">
      <div className="autolog-left">
        <Link to="/" className="autolog-logo-link">
          <img src={autoLogLogo} alt="AutoLog" className="autolog-logo-img" />
        </Link>

        <nav className="nav-links">
          {isAuth ? (
            <>
              <NavLink to="/home" className="nav-link">Dashboard</NavLink>
              <NavLink to="/vehicles" className="nav-link">Vehicles</NavLink>
              <NavLink to="/documents" className="nav-link">Documents</NavLink>
              <NavLink to="/servicings" className="nav-link">Servicings</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className="nav-link">Home</NavLink>
              <NavLink to="#" className="nav-link">About</NavLink>
              <NavLink to="#" className="nav-link">Contact</NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="navbar-right">
        {/* NOTIFICATION BELL  */}
        {isAuth && <NotificationBell />}

        {isAuth ? (
          <>
            <Link to="/profile" title="Profile">
              <button className="profile-btn">
                <FiUser />
              </button>
            </Link>
            <button className="profile-btn" title="Logout" onClick={handleLogout}>
              <FiLogOut />
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="profile-btn" title="Login">
              <FiUser />
            </button>
          </Link>
        )}
      </div>
    </header>
  )
}
