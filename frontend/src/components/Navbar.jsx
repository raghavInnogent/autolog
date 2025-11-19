import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiBell, FiUser, FiMenu } from 'react-icons/fi'
import NotificationBell from './NotificationBell'
import useAuth from '../hooks/useAuth'
import '../styles/components/Navbar.css'

export default function Navbar(){
  const [open, setOpen] = useState(false)
  const { isAuth, logout } = useAuth()
  const nav = useNavigate()
  const menuRef = useRef()

  useEffect(()=>{
    function onDoc(e){
      if(menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return ()=>document.removeEventListener('click', onDoc)
  },[])

  function handleLogout(){
    logout()
    setOpen(false)
    nav('/')
  }

  return (
    <header className="autolog-navbar">
      <div className="autolog-left">
        <div className="autolog-logo">AutoLog</div>
      </div>

      <div className="nav-center">
        <nav className="nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/vehicles" className="nav-link">Vehicles</NavLink>
          <NavLink to="/documents" className="nav-link">Documents</NavLink>
          <NavLink to="/servicings" className="nav-link">Servicings</NavLink>
        </nav>
      </div>

      <div className="navbar-right">
        <NotificationBell />

        <div style={{position:'relative'}} ref={menuRef}>
          <button className="navy-btn" title="Account" onClick={()=>setOpen(s=>!s)}>
            <FiUser />
          </button>

          {open && (
            <div style={{position:'absolute',right:0,top:44,background:'var(--card)',padding:8,borderRadius:8,border:'1px solid var(--border)',minWidth:160,zIndex:1000}}>
              {!isAuth ? (
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <Link to="/login" onClick={()=>setOpen(false)} style={{textDecoration:'none'}}>
                    <button className="navy-btn">Login</button>
                  </Link>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <Link to="/profile" onClick={()=>setOpen(false)} style={{textDecoration:'none'}}>
                    <button className="navy-btn">Profile</button>
                  </Link>
                  <button className="navy-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="navy-btn mobile-only">
          <FiMenu />
        </button>
      </div>
    </header>
  )
}
