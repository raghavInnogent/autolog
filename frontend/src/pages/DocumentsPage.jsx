import React, {useEffect, useState} from 'react'
import { documentsAPI } from '../services/api'
import { useParams, useLocation } from 'react-router-dom'
import DocumentUploadModal from '../components/DocumentUploadModal'

function useQuery(){
  return new URLSearchParams(useLocation().search)
}

export default function DocumentsPage(){
  const [docs, setDocs] = useState([])
  const [openUpload, setOpenUpload] = useState(false)
  const { type } = useParams()
  const query = useQuery()
  const qtype = type || query.get('type')

  const fetch = ()=>{
    const p = {}
    if(qtype) p.type = qtype
    documentsAPI.getAll(p).then(res=>setDocs(res.data||[])).catch(()=>{})
  }

  useEffect(()=>{ fetch() },[qtype])

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>{qtype ? `${decodeURIComponent(qtype)} Documents` : 'All Documents'}</h2>
        <button className="navy-btn" onClick={()=>setOpenUpload(true)}>Upload Document</button>
      </div>
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

      {openUpload && <DocumentUploadModal onClose={()=>setOpenUpload(false)} onUploaded={fetch} />}
    </div>
  )
}
