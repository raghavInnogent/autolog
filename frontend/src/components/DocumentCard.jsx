import React from 'react'
import { Link } from 'react-router-dom'
import { FiFileText, FiShield, FiTruck, FiFile } from 'react-icons/fi'
import '../styles/components/DocumentCard.css'

function iconFor(type){
  if(!type) return <FiFileText />
  const t = type.toLowerCase()
  if(t.includes('insurance')) return <FiShield />
  if(t.includes('emission')) return <FiFile />
  if(t.includes('warrant')) return <FiTruck />
  return <FiFileText />
}

export default function DocumentCard({doc}){
  const slug = (doc.type || doc.name || '').toString().toLowerCase().replace(/\s+/g,'-')
  const vehicle = doc.vehicle || { company: doc.vehicleCompany || doc.company || '', model: doc.vehicleModel || doc.model || '', regDate: doc.vehicleRegistrationDate || doc.registrationDate || doc.regDate }

  return (
    <Link to={`/documents/${encodeURIComponent(slug)}`} style={{textDecoration:'none'}}>
      <div className="doc-card">
        <div className="doc-top">
          <div className="doc-avatar">{iconFor(doc.type || doc.name)}</div>
          <div className="doc-body">
            <div style={{fontWeight:700}}>{doc.name || doc.type}</div>
            <div style={{color:'var(--muted)'}}>{vehicle.company ? `${vehicle.company} • ${vehicle.model || ''}` : (vehicle.model || '')}</div>
          </div>
        </div>

        <div style={{flex:1}}>
          <div style={{color:'var(--muted)',fontSize:13}}>{doc.description || ''}</div>
        </div>

        <div className="doc-meta">
          <div><strong>Issued:</strong> {doc.issuedDate || doc.issueDate || doc.createdAt || '—'}</div>
          <div><strong>Expiry:</strong> {doc.expiry || doc.expiryDate || '—'}</div>
        </div>
      </div>
    </Link>
  )
}
