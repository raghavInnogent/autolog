import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usersAPI } from '../services/api'

export default function SignupPage(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      await usersAPI.create({ name, email, password, contactNo })
      nav('/login')
    }catch(err){
      setError(err?.response?.data?.message || 'Signup failed')
    }finally{setLoading(false)}
  }

  return (
    <div style={{maxWidth:520,margin:'40px auto',padding:20,background:'var(--card)',borderRadius:8,border:'1px solid var(--border)'}}>
      <h2 style={{marginTop:0}}>Create account</h2>
      <form onSubmit={onSubmit} style={{display:'grid',gap:12}}>
        <label>Name
          <input value={name} onChange={e=>setName(e.target.value)} required style={{width:'100%',padding:8,marginTop:6,borderRadius:6,border:'1px solid var(--border)'}} />
        </label>
        <label>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',padding:8,marginTop:6,borderRadius:6,border:'1px solid var(--border)'}} />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:8,marginTop:6,borderRadius:6,border:'1px solid var(--border)'}} />
        </label>
        <label>Contact No
          <input value={contactNo} onChange={e=>setContactNo(e.target.value)} style={{width:'100%',padding:8,marginTop:6,borderRadius:6,border:'1px solid var(--border)'}} />
        </label>
        {error && <div style={{color:'crimson'}}>{error}</div>}
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button type="submit" className="navy-btn">{loading? 'Creating...' : 'Create account'}</button>
        </div>
      </form>
    </div>
  )
}
