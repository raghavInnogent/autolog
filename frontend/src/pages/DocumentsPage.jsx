import React, { useEffect, useState } from 'react'
import { documentsAPI, vehiclesAPI } from '../services/api'
import { useParams, useLocation } from 'react-router-dom'
import DocumentUploadModal from '../components/DocumentUploadModal'
import DocumentViewModal from '../components/DocumentViewModal'
import { FaFileAlt, FaCar, FaCalendarAlt, FaShieldAlt, FaFileContract, FaFilter } from 'react-icons/fa'
import '../styles/pages/DocumentsPage.css'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState([])
  const [allDocs, setAllDocs] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [openUpload, setOpenUpload] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const { type } = useParams()
  const query = useQuery()
  const qtype = type || query.get('type')

  const fetch = () => {
    const p = {}
    if (qtype) p.type = qtype
    documentsAPI.getAll(p).then(res => {
      const documents = res.data || []
      setAllDocs(documents)
      setDocs(documents)

      // Extract unique vehicles from documents for filter
      const uniqueVehicles = []
      const vehicleIds = new Set()
      documents.forEach(doc => {
        if (doc.vehicleId && !vehicleIds.has(doc.vehicleId)) {
          vehicleIds.add(doc.vehicleId)
          uniqueVehicles.push({
            id: doc.vehicleId,
            company: doc.vehicleCompany || '',
            model: doc.vehicleModel || '',
            registrationNumber: doc.registrationNumber || ''
          })
        }
      })
      setVehicles(uniqueVehicles)
    }).catch(() => { })
  }

  useEffect(() => {
    fetch()
  }, [qtype])

  useEffect(() => {
    if (selectedVehicleId === '') {
      setDocs(allDocs)
    } else {
      const filtered = allDocs.filter(doc => {
        return doc.vehicleId === Number(selectedVehicleId)
      })
      setDocs(filtered)
    }
  }, [selectedVehicleId, allDocs])

  const getIcon = (docType) => {
    switch (docType?.toLowerCase()) {
      case 'insurance': return <FaShieldAlt />
      case 'rc': return <FaCar />
      case 'warranty': return <FaFileContract />
      default: return <FaFileAlt />
    }
  }

  const getVehicleName = (doc) => {
    // Use vehicleCompany and vehicleModel from document response
    if (doc.vehicleCompany || doc.vehicleModel) {
      return `${doc.vehicleCompany || ''} ${doc.vehicleModel || ''}`.trim()
    }

    // Fallback to vehicle object if present
    if (doc.vehicle) {
      return `${doc.vehicle.company || ''} ${doc.vehicle.model || ''}`.trim()
    }

    return doc.vehicleName || 'Unknown Vehicle'
  }

  return (
    <div className="documents-page">
      <div className="documents-header">
        <h2>{qtype ? `${decodeURIComponent(qtype)} Documents` : 'All Documents'}</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: 200 }}>
            <FaFilter style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: 14 }} />
            <select
              value={selectedVehicleId}
              onChange={e => setSelectedVehicleId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                background: '#fff',
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              <option value="">All Vehicles</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.company} {v.model}{v.registrationNumber ? ` (${v.registrationNumber})` : ''}
                </option>
              ))}
            </select>
          </div>
          <button className="navy-btn" onClick={() => setOpenUpload(true)}>+ Upload Document</button>
        </div>
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
                  <h3>{d.name || d.docName}</h3>
                  <div className="document-meta">
                    <div className="meta-item">
                      <FaCar size={12} />
                      {getVehicleName(d)}
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
                <button
                  className="view-doc-btn"
                  onClick={() => setSelectedDocument(d)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {openUpload && <DocumentUploadModal onClose={() => setOpenUpload(false)} onUploaded={fetch} />}
      {selectedDocument && <DocumentViewModal document={selectedDocument} onClose={() => setSelectedDocument(null)} />}
    </div>
  )
}
