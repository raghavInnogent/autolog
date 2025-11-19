import { useEffect, useState } from 'react'
import { FiBell } from 'react-icons/fi'
import { notificationsAPI } from '../services/api'
import '../styles/components/NotificationBell.css'

export default function NotificationBell(){
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    notificationsAPI.getAll().then(res=>{ setItems(res.data || []) }).catch(()=>{}).finally(()=>setLoading(false))
  },[])

  return (
    <div className="notification-bell">
      <button className="icon-btn" onClick={()=>setOpen(s=>!s)} aria-label="Notifications">
        <FiBell />
      </button>
      {open && (
        <div className="notification-dropdown">
          <div style={{fontWeight:700,marginBottom:8}}>Notifications</div>
          {loading && <div style={{color:'var(--muted)'}}>Loading...</div>}
          {!loading && items.length===0 && <div style={{color:'var(--muted)'}}>No notifications</div>}
          <ul>
            {items.map((n,i)=> (
              <li key={i}>
                <div style={{fontSize:13,fontWeight:600}}>{n.title || 'Alert'}</div>
                <div style={{fontSize:12,color:'var(--muted)'}}>{n.body || n.message}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
