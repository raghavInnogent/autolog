// frontend/src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { vehiclesAPI } from '../services/api'

export default function ProfilePage(){
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])

  useEffect(()=>{
    vehiclesAPI.getAll().then(res=>setVehicles(res.data||[])).catch(()=>{})
  },[])

  return (
    <div style={{padding:12}}>
      <h2>Profile</h2>
      <div style={{marginBottom:16}}>
        <div><strong>Name:</strong> {user?.name || '—'}</div>
        <div><strong>Email:</strong> {user?.email || '—'}</div>
      </div>
      <h3>My Vehicles</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12}}>
        {vehicles.map(v=>(
          <div key={v.id} style={{padding:12,border:'1px solid var(--border)',borderRadius:8}}>
            <div style={{fontWeight:700}}>{v.model || 'Unknown'}</div>
26→            <div style={{color:'var(--muted)'}}>Reg: {v.registrationNumber || v.vehicleNumber || '—'}</div>
27→            <div style={{color:'var(--muted)'}}>Odometer: {v.odometer ?? '-'}</div>
28→            <div style={{color:'var(--muted)'}}>Next Service: {v.nextService || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}