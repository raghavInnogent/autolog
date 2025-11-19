import { useEffect, useState } from 'react'
import './NotificationBar.css'

export default function NotificationBar(){
  const [msg, setMsg] = useState(null)

  // placeholder: in a real app this could subscribe to global events
  useEffect(()=>{
    const t = setTimeout(()=>setMsg(null), 6000)
    return ()=>clearTimeout(t)
  },[msg])

  return (
    <div className={`notification-bar ${!msg ? 'hide' : ''}`}>
      {msg}
    </div>
  )
}
