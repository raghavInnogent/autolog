import React, { useEffect, useState } from 'react'
import { documentsAPI } from '../services/api'
import { useParams, useLocation } from 'react-router-dom'
import DocumentUploadModal from '../components/DocumentUploadModal'
import { FaFileAlt, FaCar, FaCalendarAlt, FaShieldAlt, FaFileContract } from 'react-icons/fa'
import '../styles/pages/DocumentsPage.css'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState([])
  const [openUpload, setOpenUpload] = useState(false)
  const { type } = useParams()
  const query = useQuery()
  const qtype = type || query.get('type')

  const fetch = () => {
    const p = {}
    if (qtype) p.type = qtype
    documentsAPI.getAll(p).then(res => setDocs(res.data || [])).catch(() => { })
  }

  useEffect(() => { fetch() }, [qtype])

  const getIcon = (docType) => {
    switch (docType?.toLowerCase()) {
      case 'insurance': return <FaShieldAlt />
      case 'rc': return <FaCar />
      case 'warranty': return <FaFileContract />
      default: return <FaFileAlt />
    }
  }

  return (
    <div className="documents-page">
      <div className="documents-header">
        <h2>{qtype ? `${decodeURIComponent(qtype)} Documents` : 'All Documents'}</h2>
        <button className="navy-btn" onClick={() => setOpenUpload(true)}>+ Upload Document</button>
      </div>

      {docs.length === 0 ? (
        <div className="empty-state">
          <FaFileAlt size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <h3>No documents found</h3>
          <p>Upload your vehicle documents to keep them organized.</p>
        </div>
      ) : (
        <div className="documents-grid">
          {docs.map((d, i) => (
            <div key={i} className="document-card">
              <div style={{ display: 'flex', gap: 16 }}>
                <div className="document-icon-wrapper">
                  {getIcon(d.type)}
                </div>
                <div className="document-info">
                  <h3>{d.name}</h3>
                  <div className="document-meta">
                    <div className="meta-item">
                      <FaCar size={12} />
                      {d.vehicle?.model || d.vehicleId || 'Unknown Vehicle'}
                    </div>
                    {d.expiry && (
                      <div className="meta-item" style={{ color: new Date(d.expiry) < new Date() ? 'crimson' : 'inherit' }}>
                        <FaCalendarAlt size={12} />
                        Expires: {d.expiry}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="document-actions">
                {d.url ? (
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="view-doc-btn">
                    View Document
                  </a>
                ) : (
                  <button className="view-doc-btn" disabled>View</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {openUpload && <DocumentUploadModal onClose={() => setOpenUpload(false)} onUploaded={fetch} />}
    </div>
  )
}
