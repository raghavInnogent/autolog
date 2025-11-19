import React, {useEffect, useState} from 'react'
import { documentsAPI } from '../services/api'
import { useParams, useLocation } from 'react-router-dom'

function useQuery(){
  return new URLSearchParams(useLocation().search)
}

export default function DocumentsPage(){
  const [docs, setDocs] = useState([])
  const { type } = useParams()
  const query = useQuery()
  const qtype = type || query.get('type')

  useEffect(()=>{
    const p = {}
    if(qtype) p.type = qtype
    documentsAPI.getAll(p).then(res=>setDocs(res.data||[])).catch(()=>{})
  },[qtype])

  return (
    <div>
      <h2>{qtype ? `${decodeURIComponent(qtype)} Documents` : 'All Documents'}</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:12}}>
        {docs.map((d,i)=> (
          <div key={i} style={{padding:12,background:'linear-gradient(90deg, rgba(11,18,32,0.04), rgba(255,255,255,0.02))',borderRadius:8,border:'1px solid var(--border)'}}>
            <div style={{fontWeight:700}}>{d.name}</div>
            <div style={{color:'var(--muted)'}}>Vehicle: {d.vehicle?.model || d.vehicleId || '—'}</div>
            <div style={{color:'var(--muted)'}}>Expiry: {d.expiry || '—'}</div>
            <div style={{marginTop:8}}>
              {d.url ? <a href={d.url} target="_blank" rel="noopener noreferrer" className="icon-btn">View Document</a> : <button className="icon-btn">View</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
